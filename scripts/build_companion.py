"""Extract and package already-generated companion rows; never synthesizes poses."""
from pathlib import Path
import importlib.util
import json
import os
import statistics
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
RUN=ROOT/'work/companion-v1'
DEST=ROOT/'pet/extras/companion'
MEDIA=ROOT/'docs/media/companion'
CELL=(192,208)
# Final visual QA measured shoe/torso anchors in the first package. Integer
# translation removes generated drift; it never rescales or repaints a pose.
X_STABILIZE={
    'talk':[0,6,12,19], 'search':[0,7,14,21],
    'fry':[0,6,12,20], 'sleep':[0,4,10,13],
    'petting':[0,-1,14,15],
}

def module(path,name):
    spec=importlib.util.spec_from_file_location(name,path)
    result=importlib.util.module_from_spec(spec);spec.loader.exec_module(result);return result

def normalize(image):
    data=bytearray(image.convert('RGBA').tobytes())
    for i in range(0,len(data),4):
        if data[i+3]==0:data[i:i+3]=b'\0\0\0'
    return Image.frombytes('RGBA',image.size,bytes(data))

def gif_frame(frame):
    # One explicit transparent index; full-frame disposal prevents ghost limbs.
    rgba=frame.convert('RGBA')
    rgb=Image.new('RGB',rgba.size,'#fff5d6');rgb.paste(rgba,mask=rgba.getchannel('A'))
    indexed=rgb.quantize(colors=255,method=Image.Quantize.MEDIANCUT)
    indexed.paste(255,mask=rgba.getchannel('A').point(lambda a:255 if a<128 else 0))
    indexed.info['transparency']=255
    return indexed

def build():
    manifest=json.loads((RUN/'imagegen-jobs.json').read_text(encoding='utf-8'))
    jobs=manifest['jobs']
    missing=[j['id'] for j in jobs if not (RUN/'decoded'/f"{j['id']}.png").exists()]
    if missing:raise ValueError('Missing generated sources: '+', '.join(missing))
    hatch_dir=Path(os.environ.get('HATCH_PET_DIR',str(Path.home()/'.codex/skills/hatch-pet')))
    extract=module(hatch_dir/'scripts/extract_strip_frames.py','hatch_extract')
    cleanup=module(ROOT/'scripts/clean_pet_edges.py','clean_edges')
    DEST.mkdir(parents=True,exist_ok=True);MEDIA.mkdir(parents=True,exist_ok=True)
    atlas=Image.new('RGBA',(4*CELL[0],len(jobs)*CELL[1]))
    contact=Image.new('RGB',(4*CELL[0],len(jobs)*(CELL[1]+30)),'#fff5d6')
    try:font=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',16)
    except OSError:font=ImageFont.load_default()
    draw=ImageDraw.Draw(contact)
    clips=[];all_frames=[];report={'errors':[],'clips':[],'cell':list(CELL),'visualQA':'pending'}
    prepared=[]
    for job in jobs:
        clip_id=job['id'];source=RUN/'decoded'/f'{clip_id}.png'
        with Image.open(source) as im:strip=extract.remove_chroma_background(im,(0,0,255),150)
        # Confidence cutout yields crisp sprite edges and removes low-alpha
        # generation glow/noise, without repainting the visible character.
        strip.putalpha(strip.getchannel('A').point(lambda a:255 if a>=128 else 0));strip=normalize(strip)
        slot_width=strip.width/4
        slots=[strip.crop((round(i*slot_width),0,round((i+1)*slot_width),strip.height)) for i in range(4)]
        boxes=[slot.getbbox() for slot in slots]
        if any(b is None for b in boxes):raise ValueError('Empty source slot: '+clip_id)
        # A shared viewport preserves genuine hand/head movement within each row.
        viewport=(min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes))
        prepared.append((job,strip,slots,boxes,viewport,source))
    # Seated sleep keeps the same head scale as standing actions, rather than
    # being enlarged independently to fill the cell height.
    reference_height=statistics.median((v[4][3]-v[4][1])/(v[1].width/4) for v in prepared if v[0]['id']!='sleep')
    report['standingReferenceRelativeHeight']=reference_height
    for row,(job,strip,slots,boxes,viewport,source) in enumerate(prepared):
        clip_id=job['id'];slot_width=strip.width/4
        scale=min(192/(reference_height*slot_width),176/(viewport[2]-viewport[0]),192/(viewport[3]-viewport[1]))
        size=(max(1,round((viewport[2]-viewport[0])*scale)),max(1,round((viewport[3]-viewport[1])*scale)))
        frames=[];stats=[]
        (RUN/'frames'/clip_id).mkdir(parents=True,exist_ok=True)
        draw.text((8,row*238+4),job['title'],font=font,fill='#4c292c')
        for index,slot in enumerate(slots):
            crop=slot.crop(viewport).resize(size,Image.Resampling.NEAREST)
            dx=X_STABILIZE.get(clip_id,[0,0,0,0])[index]
            origin=((192-size[0])//2+dx,202-size[1])
            crop_bounds=crop.getbbox()
            if crop_bounds[0]+origin[0]<0 or crop_bounds[2]+origin[0]>CELL[0]:
                raise ValueError(f'{clip_id}/{index}: stabilization would clip sprite')
            frame=Image.new('RGBA',CELL);frame.alpha_composite(crop,origin)
            frame,removed=cleanup.clean(frame);frame=normalize(frame)
            bounds=frame.getbbox()
            if not bounds or bounds[0]<3 or bounds[1]<3 or bounds[2]>189 or bounds[3]>205:report['errors'].append(f'{clip_id}/{index}: safety margin')
            # A source touching a slot boundary can be a clipped adjacent sprite.
            if boxes[index][0]<2 or boxes[index][2]>slot.width-2:report['errors'].append(f'{clip_id}/{index}: source touches slot edge')
            frame.save(RUN/'frames'/clip_id/f'{index:02d}.png')
            atlas.alpha_composite(frame,(index*192,row*208));contact.paste(frame,(index*192,row*238+30),frame)
            frames.append(frame);stats.append({'frame':index,'bbox':bounds,'sourceBBox':boxes[index],'horizontalStabilization':dx,'edgeKeyPixelsRemoved':removed})
        if len({f.tobytes() for f in frames})<3:report['errors'].append(f'{clip_id}: less than three distinct frames')
        gif=[gif_frame(f) for f in frames]
        gif[0].save(MEDIA/f'{clip_id}.gif',save_all=True,append_images=gif[1:],duration=job['durations'],loop=0,disposal=2,transparency=255,optimize=False)
        frames[job['poster']].save(MEDIA/f'{clip_id}-poster.png')
        clips.append({'id':clip_id,'title':job['title'],'row':row,'frames':4,'durations':job['durations'],'poster':job['poster'],'loop':clip_id in ['listen','search','calculate','sleep'],'duration':sum(job['durations']),'gif':f'media/companion/{clip_id}.gif','posterPath':f'media/companion/{clip_id}-poster.png'})
        report['clips'].append({'id':clip_id,'source':str(source.relative_to(ROOT)),'sourceSize':list(strip.size),'viewport':viewport,'frames':stats})
        all_frames.append(frames)
    atlas=normalize(atlas);atlas.save(DEST/'atlas.webp',lossless=True,exact=True);contact.save(MEDIA/'contact-sheet.png')
    # Actual packaged-frame montage, not an independently generated illustration.
    overview=[]
    for tick in range(0,3600,100):
        canvas=Image.new('RGB',(768,480),'#fff5d6');labels=ImageDraw.Draw(canvas)
        for i,(clip,frames) in enumerate(zip(clips,all_frames)):
            elapsed=tick%clip['duration'];index=0
            while index<3 and elapsed>=clip['durations'][index]:elapsed-=clip['durations'][index];index+=1
            x,y=(i%4)*192,(i//4)*240
            labels.text((x+8,y+3),clip['title'],font=font,fill='#4c292c');canvas.paste(frames[index],(x,y+28),frames[index])
        overview.append(canvas)
    overview[0].save(MEDIA/'preview.gif',save_all=True,append_images=overview[1:],duration=100,loop=0)
    config={'version':1,'cellWidth':192,'cellHeight':208,'columns':4,'rows':len(clips),'atlas':'atlas.webp','nativeCodexEventsConnected':False,'clips':clips}
    serialized=json.dumps(config,ensure_ascii=False,indent=2)
    (DEST/'animations.json').write_text(serialized+'\n',encoding='utf-8')
    (DEST/'animations.js').write_text('window.MAIMAI_COMPANION = '+serialized+';\n',encoding='utf-8')
    with Image.open(DEST/'atlas.webp') as im:
        pixels=im.convert('RGBA').tobytes()
        report['transparentRGBResidue']=sum(1 for i in range(0,len(pixels),4) if pixels[i+3]==0 and any(pixels[i:i+3]))
        report['blueKeyResidue']=sum(1 for i in range(0,len(pixels),4) if pixels[i+3]>16 and pixels[i+2]>150 and pixels[i+2]>pixels[i]+70 and pixels[i+2]>pixels[i+1]+70)
    if report['transparentRGBResidue'] or report['blueKeyResidue']:report['errors'].append('Transparency/key residue')
    (RUN/'qa/build.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    if report['errors']:raise ValueError('; '.join(report['errors']))
    print(json.dumps({'clips':len(clips),'frames':len(clips)*4,'atlas':str(DEST/'atlas.webp'),'errors':[]},ensure_ascii=False))

if __name__=='__main__':build()

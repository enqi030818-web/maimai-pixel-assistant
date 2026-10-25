[CmdletBinding()]
param([switch]$SkillOnly, [string]$DestinationRoot)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$codexRoot = if ($DestinationRoot) { $DestinationRoot } elseif ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
$codexRoot = [IO.Path]::GetFullPath($codexRoot)
$sourceSkill = Join-Path $projectRoot 'skills/maimai-butler'
$sourcePet = Join-Path $projectRoot 'pet'
if (-not (Test-Path -LiteralPath (Join-Path $sourceSkill 'SKILL.md'))) {
    throw 'Missing packaged Skill.'
}
if (-not $SkillOnly) {
    foreach ($required in @('pet.json', 'spritesheet.webp')) {
        if (-not (Test-Path -LiteralPath (Join-Path $sourcePet $required))) {
            throw 'Pet package is incomplete. Use -SkillOnly to install the Skill alone.'
        }
    }
    $petManifest = Get-Content -LiteralPath (Join-Path $sourcePet 'pet.json') -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($petManifest.id -ne 'maimai' -or $petManifest.spritesheetPath -ne 'spritesheet.webp') {
        throw 'Unexpected pet manifest.'
    }
}
function Copy-Package([string]$Source, [string]$Destination) {
    $resolvedDestination = [IO.Path]::GetFullPath($Destination)
    $permittedPrefix = $codexRoot.TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
    if (-not $resolvedDestination.StartsWith($permittedPrefix, [StringComparison]::OrdinalIgnoreCase)) {
        throw 'Package destination escaped the intended Codex directory.'
    }
    $packageParent = Split-Path -Parent $Destination
    New-Item -ItemType Directory -Force -Path $packageParent | Out-Null
    if (Test-Path -LiteralPath $Destination) {
        $backupPath = $Destination + '.backup-' + [DateTime]::Now.ToString('yyyyMMdd-HHmmss-fff')
        if (-not [IO.Path]::GetFullPath($backupPath).StartsWith($permittedPrefix, [StringComparison]::OrdinalIgnoreCase)) {
            throw 'Backup destination escaped the intended Codex directory.'
        }
        Move-Item -LiteralPath $Destination -Destination $backupPath
        Write-Output "Backup: $backupPath"
    }
    Copy-Item -LiteralPath $Source -Destination $Destination -Recurse
    Write-Output "Installed: $Destination"
}
Copy-Package $sourceSkill (Join-Path $codexRoot 'skills/maimai-butler')
if (-not $SkillOnly) { Copy-Package $sourcePet (Join-Path $codexRoot 'pets/maimai') }
Write-Output 'Reopen the Codex conversation to discover the Skill; select the custom pet in the host UI.'

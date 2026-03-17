import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hekayaConfig } from '../src/content/hekaya.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const publicRoot = path.join(projectRoot, 'public')

function toPublicFile(publicPath: string) {
  const normalized = publicPath.startsWith('/') ? publicPath.slice(1) : publicPath
  return path.join(publicRoot, normalized)
}

function collectAssetPaths() {
  const paths = new Set<string>()

  hekayaConfig.chapters.forEach((chapter) => {
    chapter.photos.forEach((photo) => {
      if (photo.src) paths.add(photo.src)
    })

    if (chapter.voiceNote?.src) {
      paths.add(chapter.voiceNote.src)
    }
  })

  hekayaConfig.constellation.memories.forEach((memory) => {
    if (memory.photo) paths.add(memory.photo)
  })

  if (hekayaConfig.finalReveal.backgroundPhoto) {
    paths.add(hekayaConfig.finalReveal.backgroundPhoto)
  }

  if (hekayaConfig.finalReveal.voiceNote?.src) {
    paths.add(hekayaConfig.finalReveal.voiceNote.src)
  }

  if (hekayaConfig.sealedEnvelope.voiceNote?.src) {
    paths.add(hekayaConfig.sealedEnvelope.voiceNote.src)
  }

  return [...paths]
}

const missing = collectAssetPaths().filter((assetPath) => {
  if (!assetPath.startsWith('/')) return false
  return !fs.existsSync(toPublicFile(assetPath))
})

if (missing.length > 0) {
  console.error('Missing Hekaya public assets:')
  missing.forEach((item) => console.error(`- ${item}`))
  process.exit(1)
}

console.log('All Hekaya assets exist.')

import express from 'express';
import path from 'path';
import cors from 'cors'
import multer from 'multer'
import fs from 'fs/promises'

const upload = multer({
  dest: path.resolve(__dirname, 'tmp')
}).single('photo')

const app : express.Application = express()
const port : number = Number(process.env.PORT) || 3001

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(cors())


app.post('/upload', (req : express.Request, res : express.Response) => {
  upload(req, res, async (err : any) => {
    if (req.file) {
      let fileName : string = `${req.file.originalname}`
      console.log(req.file)
      try {
        await fs.copyFile(
          path.resolve(__dirname, 'tmp', req.file.filename), 
          path.resolve(__dirname, 'public', fileName)
        )
        res.status(200).send('Tiedosto tallennettu onnistuneesti')
      } catch (e : any) {
        console.error('Virhe tallennuksessa', e)
        res.status(500).send('Virhe ladattaessa tiedostoa')
      }
    } else {
      res.status(400).send('Ei ladattua tiedostoa')
    }
  })

  
})

app.listen(port, () => {
  console.log(`Server started running on port ${port}`)
})
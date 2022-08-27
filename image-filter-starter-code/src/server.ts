import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get("/filteredImage", async (req, res) =>{
    const {image_url} : {image_url: string} = req.query

    if(!image_url){
      return res.status(400).send("provide image url")
    }

    const isValidated = validatedUrl(image_url)

    if(!isValidated){
      return res.status(400).send("provide a valid url")
    }

    try {
      const imageUrl = await filterImageFromURL(image_url)
      res.sendFile(imageUrl, ()=>{
      const deleteImage: Array<string> = new Array(imageUrl)
      deleteLocalFiles(deleteImage)
    })
    } catch (error) {
      res.status(401).send("image not found")
    }
  
  })

  const validatedUrl = (url: string) =>{
    url = url.toLowerCase()

    const jpeg = !url.endsWith("jpeg")
    const jpg = !url.endsWith("jpg")
    const png = !url.endsWith("png")
    const tiff = !url.endsWith("tiff")

    if(jpeg && jpg && png && tiff){
       return false
    }

    return true
  }
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
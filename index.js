const fs = require('fs');
const http = require('http');
const url = require('url');

//##############################################FILES###########################################################

//Blocking or synchronusly

 // here we gonna do read a document  from file

 //for that here we use readFileSync()
 // redFileSync()  take two parameters one is path and second is character encoding

 //Here we read the file document and store the dat in const variable readIn and console the value to see
//   const readIn = fs.readFileSync('./txt/input.txt', 'utf-8');
//   console.log(readIn); //Here it works succesfully!


  //Next we gonna write a file 
  //Here we use fs.writeFileSync() which takes two parmeter one is  path where we want to create a new file second const which we want write into that file
//  const textOut = `This is about Avacado: ${readIn}. \n Created on ${Date.now()}. `;
//   fs.writeFileSync('./txt/output.txt',textOut);
//   console.log('File wiritten Successfully');

/*#############################----------end!------------------################################################################## */


  /*---------------Non-Blocking Or Asynchronus Way--------------------------------------------------------------------------------*/
    /* here what we do is readfile() is synchronus method
     in readfile the data is read in  background . once it finish read it should return. here we return using callback
     The callback will accept two parameters one is error and 2nd is the actual data*/

//   fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//       if(err) return console.log('Error!');

//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2) =>{
//         if(err) return console.log('Error!!');
//         console.log(data2);

//         fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//             if(err) return console.log('Error!');
//             console.log(data3);

//             fs.writeFile('./txt/final.txt',`${data2} \n ${data3}`,'utf-8', err => {
//                 if (err) return console.log('Error');
//                 console.log(`Your file had been written`);
//             });
//         });
//     });
//   });
//   console.log('this is the last log to chek the programme is running asynchronusly');

  /**---------------------------------------------End!----------------------------------------------------------- */


  //-------------------------------SERVER----------------------------------------------------------------------
//here we created a new server using http in server method it accept a callback req and a response

//Replacetemplate function is used to replace the placeholder with the actual content
const replaceTemplate = (temp,product) =>{
  console.log(product.productName);
  let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
  output = output.replace(/{%IMAGE%}/g,product.image);
  output = output.replace(/{%PRICE%}/g,product.price);
  output = output.replace(/{%FROM%}/g,product.from);
  output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
  output = output.replace(/{%QUANTITY%}/g,product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g,product.description);
  output = output.replace(/{%ID%}/g,product.id);
  if(!product.organic)  output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
  return output
}


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const temProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
//The data we have here is in json so we need to parse it using json.parse()
const dataObj = JSON.parse(data);


  const server =http.createServer((req,res) =>{
    //Using destructuring we get query eg: product:Id and pathaname eg: /product
    const {query,pathname} = url.parse(req.url,true);
    
    //overview
    if(pathname ==='/' || pathname === '/overview'){
      res.writeHead(200,{'Content-type':'text/html'});
      //here below we pass the template and product details to replacetemplate to replace the placeholder with actual data
      const cardsHtml = dataObj.map(el =>replaceTemplate(tempCard,el)).join('');
      //Once the actual data is replaced with placehold then the data is should display in overview page
      //cardsHtml have the data which replaced all placeholder
      //the placeholder at overview page is replaced with actual data below
      const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        return res.end(output);

        //Product
    }else if(pathname === '/product'){
      res.writeHead(200,{'Content-type':'text/html'});
      //Here we get the id of project  eg: if we click the first item in the overview page then the id wiill be 0.
      //that id we get from req.url eg:console.log(url.parase(req.url)) here you get the requested  query and pathname
        const product = dataObj[query.id];
      //Above we get an object and this object and template is send below
      //the replace function will replace all the palceholder with the actual data using map function
        const output = replaceTemplate(temProduct,product);
        
        //here we send backc the response to the client
        return res.end(output);

        //Product
    }else if(pathname == '/api'){
            //here inside the productData we get an array of object in json
            //so we need to tell browser that we are sending json
            res.writeHead(200,{
                'Content-type':'application/json'
            });
            // console.log(productData);
            return res.end(data);
    }
    //Not Found
    else{
        //here what i am doing is setting a status code 404 which means page or resource not found
        //also specifing the header type for the response i;m sending
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'hello rohan'
        });
        return res.end('<h1>requested page not found</h1>');
    }
});
server.listen(8000,'127.0.0.1', ()=>{
    console.log('Listenning to port 8000....');
});
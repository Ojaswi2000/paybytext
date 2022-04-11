const express= require('express');
const data = require('./data');

const app= express();

app.listen(3000,()=>{
    console.log("Listening on port 3000");
});

// middleware
app.use(express.json());

//redirect from localhost
app.get('/',(req,res)=>{
    res.redirect('/api/v1/paybytext');
})

// GET request for the entire information
app.get('/api/v1/paybytext',(req,res)=>{
    res.json(data);
})

// GET requet for a single id
app.get('/api/v1/paybytext/list/byIdentity/:id',(req,res)=>{
    const id= req.params.id;
    for(let i=0;i<data.payByTextItems.length; i++){
        if(data.payByTextItems[i]._id === id){
            res.status(200).json(data.payByTextItems[i]);
            return;
        }
        else{
            res.status(404).json({code:"404",message: "Not found!"});
            res.end();
        }
    }
   
})

// app.get('/api/v1/paybytext/list/byIdentity/6019c5ce375adb942b8f9b47',(req,res)=>{
//     const response= data.payByTextItems[1]
//     res.json(response);
// })


//DELETE request for single id
app.delete('/api/v1/paybytext/:id',(req,res)=>{
    const {params} =req;
    const {id} = params;
    const index= data.payByTextItems.findIndex((element)=>{
        return (element._id === String(id));
    })

    if(index){
        let del = data.payByTextItems[index];
        data.payByTextItems.splice(index,1); //delete one object 
        res.status(200).json(del);
    }
    else{
        res.status(404).json({message: "Not found the id!"});
        res.end();
    }
    
})

//POST request for id
app.post('/api/v1/paybytext',(req,res)=>{
    const user= {
      "accountName" : req.body.accountName,
      "active" : req.body.active,
      "accountNumber" : req.body.accountNumber,
      "createdOn" : req.body.createdOn,
      "issuer" : req.body.issuer,
      "paymentType" : req.body.paymentType,
      "modifiedOn" : req.body.modifiedOn,
      "merchantId" : req.body.merchantId,
      "createdBy" : req.body.createdBy,
      "executeFlag" : req.body.executeFlag,
      "identityId" : req.body.identityId,
      "paymentMethod" : {
        "walletId" : data.payByTextItems.length+1
      },
      "modifiedBy" : req.body.modifiedBy,
      "_id" : data.payByTextItems.length+1
    }
    data.payByTextItems.push(user);
    res.json(user);
})
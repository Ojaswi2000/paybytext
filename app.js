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


// handler for GET request for a single id
const handleGetPayByTextByIdentityId=(req,res)=>{
    const {params}=req;
    const {id} = params;
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
}



// GET requet for a single id
app.get('/api/v1/paybytext/list/byIdentity/:id',(req,res)=>{
    
   
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

    const {body} =req;
    const {accountName, active, accountNumber,createdOn,issuer,paymentType,
    modifiedOn,merchantId,createdBy,executeFlag,identityId,paymentMethod,
    modifiedBy,_id,walletId} =body; 

    const user_id= data.payByTextItems.length+1;

    const user= {
      accountName,
      active,
      accountNumber,
      createdOn,
      issuer,
      paymentType,
      modifiedOn,
      merchantId,
      createdBy,
      executeFlag,
      identityId,
      paymentMethod:{
          walletId:user_id
      },
      modifiedBy,
      _id
    }
    data.payByTextItems.push(user);
    res.status(200).json({"code":200, "message":"Successfully added user"});
})
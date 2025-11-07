import React from 'react'
import Pricing from '../components/Pricing'
import subscription from '../services/subscription'
const premium = () => {
  const createOrder = async({planType})=>{
    console.log("plan",planType);
    let order;
    try {
       order = await subscription.createOrder({planType})
      console.log(order.data);
      
    } catch (error) {
      
    }
  
  const {amount,currency,orderId,notes} = order.data
const options = {
    key:"rzp_test_RckpqiN886sfR0",
    amount,
    currency,
    name: "Connectly",
    description:"Connect to other developers",
    image:"https://via.placeholder.com/150",  
    order_id:orderId ,
    prefill:{
      name:notes.firstName + " " + notes.lastName,
      email:notes.email,
      contact:"9999999999",
    },
    handler: async function (response){
        // here call backend to verify
        await axios.post('/api/payment/verify', response);
    }
};
 const rzp = new window.Razorpay(options);
 rzp.open();
  }


  return (
    <div className='flex justify-center gap-6 m-5'>

      {/* Silver */}
      <Pricing 
       clickHandle ={createOrder}
        title="Silver"
        price={9}
        features={[
          "Basic image generation",
          "Standard quality export",
          "Limited style presets"
        ]}
        disabledFeatures={[
          "Batch processing",
          "Cloud storage integration",
          "AI enhancements"
        ]}
      />

      {/* Gold */}
      <Pricing 
      clickHandle ={createOrder}
        title="Gold"
        price={29}
        features={[
          "High-resolution image generation",
          "Customizable style templates",
          "Batch processing capabilities",
          "AI-driven image enhancements"
        ]}
        disabledFeatures={[
          "Seamless cloud integration",
          "Real-time collaboration tools"
        ]}
      />

    </div>
  )
}

export default premium

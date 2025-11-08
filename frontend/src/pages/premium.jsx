import React from 'react'
import Pricing from '../components/Pricing'
import subscription from '../services/subscription'
import { useState } from 'react'
const premium = () => {
  const [isPremium, setIsPremium] = useState(true) 
  const verifyPremiumUser = async()=>{
    try {
      const res = await subscription.checkPremium()
      if(res.data.isPremium){
        setIsPremium(true)
      }else{
        setIsPremium(false)
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const createOrder = async({planType})=>{
    console.log("plan",planType);
    let order;
    try {
       order = await subscription.createOrder({planType})
      console.log(order.data);
      
    } catch (error) {
      console.log(error);
      
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
    handler:verifyPremiumUser
      
    }
     const rzp = new window.Razorpay(options);
 rzp.open();
 };

  




  return (
    <div className="flex flex-col sm:flex-row justify-center gap-6 m-5">

      {/* Silver */}
      <Pricing 
       clickHandle ={createOrder}
       isPremium={isPremium}
      
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
      isPremium={isPremium}
    
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

import React from 'react'

const Pricing = ({clickHandle,title, price, features, disabledFeatures}) => {
  return (
    <div className="card w-96 bg-base-100 shadow-sm">
      <div className="card-body">
        <span className="badge badge-xs badge-warning">{title === "Gold" ? "Most Popular" : ""}</span>

        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{title}</h2>
          <span className="text-xl">${price}/mo</span>
        </div>

        <ul className="mt-6 flex flex-col gap-2 text-xs">
          {features.map((f,i)=>(
            <li key={i}>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              <span>{f}</span>
            </li>
          ))}

          {disabledFeatures.map((f,i)=>(
            <li key={i} className="opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              <span className="line-through">{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <button className="btn btn-primary btn-block" onClick={()=>clickHandle({planType:title})}>Subscribe</button>
        </div>
      </div>
    </div>
  )
}

export default Pricing

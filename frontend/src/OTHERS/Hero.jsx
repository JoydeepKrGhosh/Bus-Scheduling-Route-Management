const Hero = () =>{
return(
<>
<div className="h-full max-width-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 shadow-lg ">
<section className="flex flex-center">
  <div>
  <p className="text-7xl pt-40 font-bold pl-16 text-white w-[700px]">
  Charter with us <br />
  for an adventure- <br />
  filled journey</p>
  <br />
  <p className="text-xl text-white-500 pl-16 text-white w-[650px]">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem quas sequi atque veritatis consectetur asperiores deserunt amet facere molestias laborum?</p>
  <br />
  <button className="ml-16 border-2 border-white-900 rounded-[50px] bg-yellow-500 px-7 py-3 cursor-pointer text-white">Get Started</button>
  </div>
  <img src="https://web.moxcreative.com/bigtranz/wp-content/uploads/sites/19/2023/03/Coach-Bus-mockup-04.png" alt="bus" className=" w-[800px] h-[600px] pt-4" />
</section>

</div>

</>

)


}

export default Hero
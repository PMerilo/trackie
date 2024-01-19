/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
'use client';
import Activity from "./components/activity";

const user = {
  name: "hello",
  imageUrl: "https://i.imgur.com/yXOvdOSs.jpg",
  imageSize: 90,
};

/*limit products to 4 only*/
const products = [
  { title: "Cabbage", id: 1 },
  { title: "Garlic", id: 2 },
  { title: "Apple", id: 3 },
  { title: "Peach", id: 4 },
];

function handleClick() {
  var yes = (document.getElementById('hobbyId') as HTMLInputElement).value;
  alert("You clicked me! {yes}");
  console.log(yes)
}

const listItems = products.map((product) => (
  <Activity key={product}></Activity>
  // <button
  //   key={product.id}
  //   className="btn w-4/5 bg-lime-300 btn-wide sm:btn-sm md:btn-md lg:btn-lg"
  // >
  //   {product.title}
  // </button>
  // <a className="card w-4/5 bg-base-100 shadow-xl" key={product.id} onClick={handleClick}>
  //   <div className="grid grid-cols-4">
  //     <div className="flex justify-evenly bg-lime-200">
  //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 mt-5">
  //     <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
  //     <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
  //     <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
  //   </svg>
  //   </div>
  //     <div className="card-body bg-lime-200 col-span-3">
  //       <h2 className="card-title">{product.title}</h2>
  //       <p>Description</p>
  //       <div className="card-actions justify-end">
  //         {/* <button
  //         className="btn w-4/5 bg-lime-300 btn-wide sm:btn-sm md:btn-md lg:btn-lg">
  //         {product.title}
  //       </button> */}
  //       </div>
  //       {/* <div className="card-actions justify-end">
  //       <div className="badge badge-outline">Fashion</div>
  //       <div className="badge badge-outline">Products</div>
  //     </div> */}
  //     <input type="hidden" name="hobbyId" value={product.id} />
  //     </div>
  //   </div>
  // </a>
));

export default function Home() {
  return (
    <main className="h-screen">
      <div className="sm:px-20 md:px-30">
        <div className="pt-10">
          <h1 className="text-5xl font-bold pt-20 sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
            {/* !!!!make ^^ text bigger */}
            Good Morning {user.name}
          </h1>
          <div className="grid py-6 grid gap-4">
            <div>What would you like to do today?</div>
            {/* <div>
          What would you like to do today?
        </div> */}
          </div>
        </div>
      </div>
      <div className="container mx-auto pt-5">
        <div className="grid grid-cols-2 gap-y-6 grid-rows-2 justify-items-center">
          {listItems}
          <button className="btn w-4/5 justify-self-center col-start-2 col-end-3 btn-wide sm:btn-sm md:btn-md lg:btn-lg">
            I want to choose something else
          </button>
        </div>
      </div>
    </main>
  );
}

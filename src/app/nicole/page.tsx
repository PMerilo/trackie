/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

const user = {
  name: "Human",
  imageUrl: "https://i.imgur.com/yXOvdOSs.jpg",
  imageSize: 90,
};

export default function Home() {
  return (
    <main className="h-screen">
      <div className="sm:px-20 md:px-30">
        <div className="pt-10">
          <h1 className="text-5xl font-bold pt-20 sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl"> 
          {/* !!!!make ^^ text bigger */}
            {/* <img
              className="avatar"
              src={user.imageUrl}
              alt={"Photo of " + user.name}
              style={{
                width: user.imageSize,
                height: user.imageSize,
              }}
            /> */}
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
      <div className="container mx-auto pt-10">
        <div className="grid grid-cols-4 gap-4 grid-rows-2">
          <div className="col-span-4 flex justify-around">
            <button type="button" className="btn bg-green-300">
              test
            </button>
            <button type="button" className="btn bg-green-300">
              not working
            </button>
          </div>
          <div className="col-span-4 flex justify-around">
            <button type="button" className="btn bg-green-300">
              1
            </button>
            <button type="button" className="btn bg-green-300">
              1
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

const user = {
  name: "Human",
  imageUrl: "https://i.imgur.com/yXOvdOSs.jpg",
  imageSize: 90,
};

export default function Home() {
  return (
    <main className="">
      <div className="container mx-auto">
        <div className="pt-20">
          <h1 className="text-5xl font-bold pt-20">
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
      <div className="container mx-auto">
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

'use client'
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const NaveenSelector = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center py-8">
      <div className="container text-center px-4" style={{marginTop: '-250px'}}>
        <h1 className="text-5xl font-bold mb-6">Choose Your Emotion Recognition Model</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div 
            className="card bg-gray-800 hover:bg-gray-700 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1"
            onClick={() => handleNavigate('/naveenAPI')}
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title">Use API</h2>
              <p>Select this option to use the API model for emotion recognition.</p>
            </div>
          </div>
          <div 
            className="card bg-gray-800 hover:bg-gray-700 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1"
            onClick={() => handleNavigate('/naveenModel')}
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title">Use Pretrained Model</h2>
              <p>Select this option to use the pretrained model for emotion recognition.</p>
            </div>
          </div>
        </div>
        <p className="text-gray-500 mt-6">
          Select an option to proceed with patient emotion recognition.
        </p>
      </div>
    </main>
  );
};

export default NaveenSelector;
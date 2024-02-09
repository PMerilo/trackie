
export default function Signup() {
  function Submit() {
    return (
      <button className="btn btn-primary btn-block" type="submit" disabled={false}>
        Register
      </button>
    );
  }
  return (
    <>
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">Sign Up</h2>
          <form className="w-full" action="">
            <label className="form-control w-full gap-y-4">
              <div>
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input type="text" placeholder="Type here" className="input input-bordered w-full" />
              </div>
              <div>
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input type="text" placeholder="Type here" className="input input-bordered w-full" />
              </div>
              <div>
                <div className="label">
                  <span className="label-text">Confirm Password</span>
                </div>
                <input type="text" placeholder="Type here" className="input input-bordered w-full" />
              </div>
            </label>
          </form>
          <div className="card-actions justify-end w-full mt-6">
            <button className="btn btn-primary btn-block">Register</button>
          </div>
        </div>
      </div>
    </>
  )
}

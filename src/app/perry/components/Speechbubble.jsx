import React, { useEffect, useState } from "react"

export const Speechbubble = (props) => {
	const [dementia, setDementia] = useState(false)
	const flaskurl =
		process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:5000"

	useEffect(() => {
		console.log(`start fetch! on ${flaskurl}`)
		const formdata = new FormData()
		formdata.append("data", props.content)
		fetch(flaskurl + "/perry/predict", {
			method: "POST",
			body: formdata,
		}).then((res) => {
			res
				.json()
				// .then(data => console.log(data))
				.then((data) => setDementia(data.result == "Positive"))
		})
	}, [])

	return (
		<div className="chat chat-start">
			{dementia ? (
                <>
				<div className="chat-bubble chat-bubble-warning">{props.content}</div>
                <div className="chat-footer text-warning">
                    Concerning speech
                </div>
                </>
			) : (
				<div className="chat-bubble">{props.content}</div>
			)}
		</div>
	)
}

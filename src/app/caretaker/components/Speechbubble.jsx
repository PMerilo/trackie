'use client'

import React, { useEffect, useState } from "react"

export const Speechbubble = ({ content, timestamp, prediction }) => {
	return (
		<div className="chat chat-start">
			<>
			<div className="chat-header">
				<time className="text-xs opacity-50">{timestamp}</time> 
			</div>
			<div className={`chat-bubble chat-bubble-info ${prediction && "chat-bubble-warning"}`}>{content || <span className="text-gray-600">{"*inaudible*"}</span> }</div>
			{ prediction &&
				<div className="chat-footer text-warning">
					Concerning speech 
				</div>
			}
			</>
		</div>
	)
}

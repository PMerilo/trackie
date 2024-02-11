"use client";

import React, { useState, useEffect, useRef } from "react"

export default function Viewer(props) {
    const videoRef = useRef(null)
   
    async function PeerConnection(media) {
        const pc = new RTCPeerConnection({
            iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
        });

        const localTracks = [];

        if (/camera|microphone/.test(media)) {
            const tracks = await getMediaTracks('user', {
                video: media.indexOf('camera') >= 0,
                audio: media.indexOf('microphone') >= 0,
            });
            tracks.forEach(track => {
                pc.addTransceiver(track, {direction: 'sendonly'});
                if (track.kind === 'video') localTracks.push(track);
            });
        }

        if (media.indexOf('display') >= 0) {
            const tracks = await getMediaTracks('display', {
                video: true,
                audio: media.indexOf('speaker') >= 0,
            });
            tracks.forEach(track => {
                pc.addTransceiver(track, {direction: 'sendonly'});
                if (track.kind === 'video') localTracks.push(track);
            });
        }

        if (/video|audio/.test(media)) {
            const tracks = ['video', 'audio']
                .filter(kind => media.indexOf(kind) >= 0)
                .map(kind => pc.addTransceiver(kind, {direction: 'recvonly'}).receiver.track);
            localTracks.push(...tracks);
        }

        videoRef.current.srcObject = new MediaStream(localTracks);

        return pc;
    }

    async function getMediaTracks(media, constraints) {
        try {
            const stream = media === 'user'
                ? await navigator.mediaDevices.getUserMedia(constraints)
                : await navigator.mediaDevices.getDisplayMedia(constraints);
            return stream.getTracks();
        } catch (e) {
            console.warn(e);
            return [];
        }
    }

    async function connect(media) {
        const pc = await PeerConnection(media);
        const url = new URL('api/ws' + "?src=tapo1&media=video+audio", "http://localhost:1984/");
        const ws = new WebSocket('ws' + url.toString().substring(4));

        ws.addEventListener('open', () => {
            pc.addEventListener('icecandidate', ev => {
                if (!ev.candidate) return;
                const msg = {type: 'webrtc/candidate', value: ev.candidate.candidate};
                ws.send(JSON.stringify(msg));
            });

            pc.createOffer().then(offer => pc.setLocalDescription(offer)).then(() => {
                const msg = {type: 'webrtc/offer', value: pc.localDescription.sdp};
                ws.send(JSON.stringify(msg));
            });
        });

        ws.addEventListener('message', ev => {
            const msg = JSON.parse(ev.data);
            if (msg.type === 'webrtc/candidate') {
                pc.addIceCandidate({candidate: msg.value, sdpMid: '0'});
            } else if (msg.type === 'webrtc/answer') {
                pc.setRemoteDescription({type: 'answer', sdp: msg.value});
            }
        });
    }

    useEffect(() => {
        connect('video+audio');
    }, [])
    return (
        <>
            <video className="pointer-events-none" width="1280" height="1000" ref={videoRef} autoPlay playsInline muted={props.muted}>Receiver</video>
        </>
    )
}

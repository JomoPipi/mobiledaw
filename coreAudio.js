const CoreAudio = (function(){
    const nTracks = 5;
    const nSteps = 8;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)

    const System = {
        on: false,
        current: 0,
        currentTrack:0,
        getTempo: _ => (2**D('tempo').value)**2/256|0,
        steps: [...Array(nSteps)].map(_=>({ active: 1, muted: 0 })),
        masterVolume: audioCtx.createGain(),
        play: _ => {
            setTimeout(_ => {
                Tracks.forEach(t=>t.notes[System.current % nSteps].stop())
                System.steps[System.current % nSteps].btn.classList.remove('being-played')
                let i = 0
                do {
                } while (++i < 9 && !System.steps[++System.current % nSteps].active)
                if (i <= nSteps && System.on && !System.steps[System.current % nSteps].muted) 
                    Tracks.forEach(t=>t.notes[System.current % nSteps].play())
                if (i <= nSteps && System.on) {
                    System.steps[System.current % nSteps].btn.classList.add('being-played')
                }

                System.play()
            }
            , 30000/System.getTempo())
        }
    }
    {
        System.masterVolume.gain.value = 0.5
        System.masterVolume.connect(audioCtx.destination)
        System.play()
    }

    const Tracks = [...Array(nTracks)].map(_ => {
        const trackVol = audioCtx.createGain()
        trackVol.gain = 0.5
        trackVol.connect(System.masterVolume)
        return {
            notes: [...Array(nSteps)].map((tone,i) => {
                tone = audioCtx.createOscillator()
                tone.frequency.value = 440 * (2 ** (1/12.0)) ** i // multiply by the 12th root of 2 to get the next key
                tone.type = 'sine'
                tone.isConnected = false
                tone.muted = false//ti ? true : false
                tone.gain = audioCtx.createGain()
                tone.gain.gain.value = 0
                tone.gain.connect(trackVol)
                tone.connect(tone.gain)
                tone.attack = 0.015
                tone.decay = 0.05
                tone.toggle = _ => 
                    tone.isConnected || tone.muted ?
                        tone.stop() : tone.play()
                tone.stop = _ => {
                    if (tone.isConnected) {
                        tone.gain.gain.setTargetAtTime(0, audioCtx.currentTime, tone.decay)
                        // tone.disconnect(tone.gain)
                        tone.isConnected = 0
                    }
                    return false
                }
                tone.play = _ => {
                    if (!(tone.isConnected || tone.muted)) {
                        tone.gain.gain.setTargetAtTime(1, audioCtx.currentTime, tone.attack)
                        // tone.connect(tone.gain)
                        tone.isConnected = 1
                    }
                    return true
                }
                return tone
            }),
            volume: trackVol,
            transpose: 0,
            transposeOctave: 0,
            type: 'sine',
            modIntensity: 0,
            modPeriod: 0,
            modWave: 'sine'
        }
    })

    return {
        System: System,
        Tracks: Tracks
    }
})()
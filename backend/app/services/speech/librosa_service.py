import numpy as np


def analyze_speech(audio_path):
    import librosa

    y, sr = librosa.load(audio_path, sr=None)

    duration = librosa.get_duration(y=y, sr=sr)

    rms = librosa.feature.rms(y=y)[0]
    average_energy = float(np.mean(rms))

    zcr = librosa.feature.zero_crossing_rate(y)[0]
    average_zcr = float(np.mean(zcr))

    spectral_centroid = librosa.feature.spectral_centroid(
        y=y,
        sr=sr
    )[0]

    average_pitch_proxy = float(np.mean(spectral_centroid))

    tempo, _ = librosa.beat.beat_track(
        y=y,
        sr=sr
    )

    tempo_value = float(np.asarray(tempo).reshape(-1)[0])

    return {
        "duration_seconds": round(float(duration), 2),
        "average_energy": round(average_energy, 4),
        "zero_crossing_rate": round(average_zcr, 4),
        "spectral_centroid": round(average_pitch_proxy, 2),
        "tempo_bpm": round(tempo_value, 2),
    }
import librosa
import numpy as np


def analyze_speech(audio_path):
    """
    Extract measurable speech features from an audio file.
    """

    # Load audio
    y, sr = librosa.load(audio_path, sr=None)

    # Duration
    duration = librosa.get_duration(y=y, sr=sr)

    # RMS Energy
    rms = librosa.feature.rms(y=y)[0]
    average_energy = float(np.mean(rms))

    # Zero Crossing Rate
    zcr = librosa.feature.zero_crossing_rate(y)[0]
    average_zcr = float(np.mean(zcr))

    # Spectral Centroid
    spectral_centroid = librosa.feature.spectral_centroid(
        y=y,
        sr=sr
    )[0]

    average_pitch_proxy = float(np.mean(spectral_centroid))

    # Tempo
    tempo, _ = librosa.beat.beat_track(
        y=y,
        sr=sr
    )

    # Convert NumPy values into normal Python values
    tempo_value = float(np.asarray(tempo).reshape(-1)[0])

    return {
        "duration_seconds": round(float(duration), 2),
        "average_energy": round(average_energy, 4),
        "zero_crossing_rate": round(average_zcr, 4),
        "spectral_centroid": round(average_pitch_proxy, 2),
        "tempo_bpm": round(tempo_value, 2),
    }
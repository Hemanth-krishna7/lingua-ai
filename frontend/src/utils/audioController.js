/**
 * Pure ES6 AudioController class to isolate HTMLAudioElement operations,
 * Object URL allocations, and event listeners from React state/components.
 */
export class AudioController {
  constructor() {
    this.audio = null;
    this.objectUrl = null;
  }

  /**
   * Pre-unlock the HTMLAudioElement context on direct user gesture threads
   * to bypass strict mobile browser autoplay restrictions.
   */
  unlock() {
    if (!this.audio) {
      this.audio = new Audio();
    }
    // Set silent WAV data-uri and trigger play/pause immediately
    this.audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA';
    this.audio.play()
      .then(() => {
        this.audio.pause();
      })
      .catch((err) => {
        if (import.meta.env.DEV) {
          console.log('[AUDIO UNLOCK] Autoplay restriction unlock attempted:', err.message);
        }
      });
  }

  /**
   * Play the generated speech Audio Blob URL.
   * Cleans up any prior audio stream or Object URL immediately before starting.
   */
  play(blobUrl, onStart, onEnd, onError) {
    this.stop(); // Clear prior playback context first

    if (!this.audio) {
      this.audio = new Audio();
    }

    this.objectUrl = blobUrl;
    this.audio.src = blobUrl;

    this.audio.onplay = () => {
      if (import.meta.env.DEV) {
        console.log('[AUDIO PLAY]');
      }
      if (onStart) onStart();
    };

    this.audio.onended = () => {
      if (import.meta.env.DEV) {
        console.log('[AUDIO STOP]');
      }
      this.cleanupBlobOnly();
      if (onEnd) onEnd();
    };

    this.audio.onerror = (e) => {
      console.error('[AUDIO STOP] Audio element error occurred');
      this.cleanupBlobOnly();
      if (onError) onError(e);
    };

    this.audio.play().catch((err) => {
      console.error('[AUDIO PLAY FAILED] Autoplay or format issue:', err.message);
      this.cleanupBlobOnly();
      if (onError) onError(err);
    });
  }

  /**
   * Pause active audio playback.
   */
  pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      if (import.meta.env.DEV) {
        console.log('[AUDIO STOP]');
      }
      return true;
    }
    return false;
  }

  /**
   * Resume paused audio playback.
   */
  resume() {
    if (this.audio && this.audio.paused && this.audio.src) {
      if (import.meta.env.DEV) {
        console.log('[AUDIO PLAY]');
      }
      this.audio.play().catch((err) => {
        console.error('[AUDIO RESUME FAILED] Playback failed:', err.message);
      });
      return true;
    }
    return false;
  }

  /**
   * Stop active audio playback and clear audio element sources completely.
   */
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
      try {
        this.audio.load(); // Flush audio buffer
      } catch {
        // Safely catch any DOM Load interruptions
      }
    }
    this.cleanupBlobOnly();
  }

  /**
   * Revoke Object URL to release memory.
   */
  cleanupBlobOnly() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  /**
   * Entirely destroy the Audio Element instance and clean up resources.
   */
  destroy() {
    this.stop();
    this.audio = null;
  }
}

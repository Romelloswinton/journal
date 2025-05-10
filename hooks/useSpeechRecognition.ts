"use client"

import { useState, useCallback, useRef, useEffect } from "react"

// Define interfaces for Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  grammars: any
  interimResults: boolean
  lang: string
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: ((event: Event) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onstart: ((event: Event) => void) | null
  onspeechend: ((event: Event) => void) | null
  onaudiostart: ((event: Event) => void) | null
  onsoundstart: ((event: Event) => void) | null
  onsoundend: ((event: Event) => void) | null
  onaudioend: ((event: Event) => void) | null
  onnomatch: ((event: Event) => void) | null
  start(): void
  stop(): void
  abort(): void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
  prototype: SpeechRecognition
}

// Extend Window interface to include Speech Recognition
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

/**
 * Type for available languages in speech recognition
 */
export type SpeechRecognitionLanguage =
  | "en-US" // English (United States)
  | "en-GB" // English (United Kingdom)
  | "es-ES" // Spanish
  | "fr-FR" // French
  | "de-DE" // German
  | "it-IT" // Italian
  | "pt-BR" // Portuguese (Brazil)
  | "ja-JP" // Japanese
  | "ko-KR" // Korean
  | "zh-CN" // Chinese (Simplified)
  | "zh-TW" // Chinese (Traditional)
  | "ar-SA" // Arabic
  | "ru-RU" // Russian
  | "nl-NL" // Dutch
  | "hi-IN" // Hindi
  | string // Allow custom languages

/**
 * Configuration options for the speech recognition hook
 */
interface SpeechRecognitionOptions {
  /** Language for speech recognition (default: 'en-US') */
  language?: SpeechRecognitionLanguage
  /** Whether recognition should be continuous (default: false) */
  continuous?: boolean
  /** Whether interim results should be returned (default: true) */
  interimResults?: boolean
  /** Maximum alternatives to return (default: 1) */
  maxAlternatives?: number
}

/**
 * Result from the useSpeechRecognition hook
 */
interface SpeechRecognitionHookResult {
  /** Whether speech recognition is supported in the current browser */
  isSupported: boolean
  /** Whether speech recognition is currently active */
  isListening: boolean
  /** Any error that occurred during speech recognition */
  error: string | null
  /** Transcript of the recognized speech */
  transcript: string
  /** Start speech recognition */
  startListening: () => void
  /** Stop speech recognition */
  stopListening: () => void
  /** Reset the transcript */
  resetTranscript: () => void
}

/**
 * Custom hook for speech recognition
 * @param options Configuration options for speech recognition
 * @returns Object with state and methods for speech recognition
 */
export function useSpeechRecognition(
  options: SpeechRecognitionOptions = {}
): SpeechRecognitionHookResult {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Store the recognition instance in a ref to persist between renders
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Check if browser supports speech recognition
  const isSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition !== undefined ||
      window.webkitSpeechRecognition !== undefined)

  // Cleanup function for when component unmounts or recognition stops
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error("Error stopping speech recognition:", e)
        }
      }
    }
  }, [isListening])

  // Start speech recognition
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported in this browser.")
      return
    }

    try {
      setIsListening(true)
      setError(null)

      // Create a speech recognition instance if not already created
      if (!recognitionRef.current) {
        const SpeechRecognitionAPI =
          window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognitionAPI) {
          setIsListening(false)
          setError("Speech recognition is not supported in this browser.")
          return
        }

        recognitionRef.current = new SpeechRecognitionAPI()

        // Configure recognition with options
        recognitionRef.current.continuous = options.continuous ?? false
        recognitionRef.current.interimResults = options.interimResults ?? true
        recognitionRef.current.lang = options.language ?? "en-US"
        recognitionRef.current.maxAlternatives = options.maxAlternatives ?? 1

        // Handle results
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptText = event.results[i][0].transcript

            if (event.results[i].isFinal) {
              finalTranscript += transcriptText
            } else {
              interimTranscript += transcriptText
            }
          }

          // Update transcript state
          setTranscript((prevTranscript) => {
            // If continuous mode is off, replace the transcript
            if (!options.continuous) {
              return finalTranscript || interimTranscript
            }

            // If continuous mode is on, append to the transcript
            const newTranscript =
              prevTranscript +
              (prevTranscript && (finalTranscript || interimTranscript)
                ? " "
                : "") +
              (finalTranscript || interimTranscript)

            return newTranscript
          })
        }

        // Handle end of recognition
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        // Handle errors
        recognitionRef.current.onerror = (
          event: SpeechRecognitionErrorEvent
        ) => {
          setIsListening(false)
          setError(`Error occurred in recognition: ${event.error}`)
        }
      }

      // Start recognition
      recognitionRef.current.start()
    } catch (error) {
      setIsListening(false)
      setError("Failed to start voice recording")
      console.error("Voice recording error:", error)
    }
  }, [isSupported, options])

  // Stop speech recognition
  const stopListening = useCallback(() => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
      } catch (e) {
        console.error("Error stopping speech recognition:", e)
      }
    }
  }, [isListening])

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript("")
  }, [])

  return {
    isSupported,
    isListening,
    error,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  }
}

export default useSpeechRecognition

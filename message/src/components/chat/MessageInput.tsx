import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Paperclip, Smile, Mic, X, File as FileIcon, Image as ImageIcon, Square } from 'lucide-react';

interface MessageInputProps {
  onSend: (text: string, file: File | null) => void;
  placeholder?: string;
  isUploading?: boolean;
}

const EMOJIS = ['\u{1F44D}', '\u2764\uFE0F', '\u{1F602}', '\u{1F62E}', '\u{1F622}', '\u{1F64C}', '\u{1F525}', '\u2705'];

export default function MessageInput({ onSend, placeholder = 'Type a message...', isUploading = false }: MessageInputProps) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && !selectedFile) return;
    onSend(trimmed, selectedFile);
    setText('');
    removeFile();
    setShowEmoji(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  };

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert("File is too large. Maximum size is 15MB.");
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    e.target.value = '';
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) window.clearInterval(recordingTimerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showEmoji) return;
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmoji]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordingChunksRef.current = [];
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordingChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (recordingChunksRef.current.length === 0) return;
        const audioBlob = new Blob(recordingChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
        onSend('', audioFile);
      };
      recorder.start();
      setIsRecording(true);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      window.alert('Microphone permission is required to send a voice message.');
    }
  };

  const handleMicClick = () => {
    if (isUploading) return;
    if (isRecording) {
      stopRecording();
      return;
    }
    startRecording();
  };

  return (
    <div className="px-3 py-2 bg-violet-950/20 border-t border-violet-800/40 relative">
      
      {selectedFile && (
        <div className="mb-2 px-2 py-1.5 bg-violet-900/30 border border-violet-800/50 rounded-xl flex items-center justify-between gap-2 w-fit max-w-full">
          <div className="flex items-center gap-2 overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-8 h-8 object-cover rounded-lg flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 bg-violet-800 text-violet-400 rounded-lg flex items-center justify-center flex-shrink-0">
                {selectedFile.type.startsWith('video/') ? <ImageIcon size={14} /> : <FileIcon size={14} />}
              </div>
            )}
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">{selectedFile.name}</span>
            </div>
          </div>
          <button onClick={removeFile} className="p-1 text-violet-400 hover:text-rose-400 transition">
            <X size={14} />
          </button>
        </div>
      )}

      {showEmoji && (
        <div className="mb-2 flex items-center gap-2 p-1.5 bg-violet-900 border border-violet-700/50 rounded-xl w-fit absolute bottom-14 shadow-2xl">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); insertEmoji(emoji); }}
              className="text-lg hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,.pdf,.doc,.docx" />

        <button 
          type="button"
          onClick={handlePaperclipClick}
          disabled={isUploading}
          className="p-1.5 rounded-xl hover:bg-white/10 text-violet-400 hover:text-white transition flex-shrink-0" 
        >
          <Paperclip size={18} />
        </button>

        <div ref={emojiPickerRef} className="flex-1 flex items-end bg-violet-900/50 border border-violet-800/30 rounded-2xl px-3 py-1.5 gap-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={placeholder}
            disabled={isUploading}
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-violet-400 text-sm outline-none resize-none leading-tight py-0.5 max-h-24 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            className={`p-1 transition flex-shrink-0 self-end ${showEmoji ? 'text-amber-400' : 'text-violet-400 hover:text-white'}`}
          >
            <Smile size={18} />
          </button>
        </div>

        {(text.trim() || selectedFile) ? (
          <button
            type="button"
            onClick={handleSend}
            disabled={isUploading}
            className="p-2 bg-gradient-to-br from-violet-500 to-indigo-500 text-white rounded-xl shadow-lg shadow-violet-500/20 active:scale-95 transition flex-shrink-0 disabled:opacity-50"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : <span className="text-sm font-bold tracking-widest px-1">SEND</span>}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isUploading}
            className={`p-2 rounded-xl transition flex-shrink-0 ${isRecording ? 'bg-rose-500 text-white' : 'text-violet-400 hover:text-white hover:bg-white/10'}`}
          >
            {isRecording ? <Square size={18} /> : <Mic size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

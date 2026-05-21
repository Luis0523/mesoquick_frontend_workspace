import { useRef, useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  previewClass?: string;
  accept?: string;
  maxSizeMB?: number;
}

export const ImageUpload = ({
  value,
  onChange,
  label = 'Imagen',
  previewClass = 'w-full h-48',
  accept = 'image/png,image/jpeg,image/webp,image/gif,image/avif',
  maxSizeMB = 5,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBase64 = value.startsWith('data:image/');
  const previewUrl = isBase64 || !value ? value : value;

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        reject(new Error(`La imagen no puede superar los ${maxSizeMB}MB`));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error al leer la imagen'));
      reader.readAsDataURL(file);
    });

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes');
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      onChange(base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la imagen');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => inputRef.current?.click();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const hasImage = !!value;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-colors ${previewClass} flex flex-col items-center justify-center overflow-hidden ${
          dragOver
            ? 'border-primary bg-primary/5'
            : hasImage
              ? 'border-gray-300'
              : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
        }`}
      >
        {hasImage ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <span className="bg-white/90 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                  <Upload size={14} />
                  Cambiar
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="text-center p-4">
            <Image className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-500">Haz clic o arrastra una imagen aquí</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP, AVIF — máx {maxSizeMB}MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

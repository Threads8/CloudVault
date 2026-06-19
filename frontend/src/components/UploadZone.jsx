import React from 'react';
import { useDropzone } from 'react-dropzone';

const UploadZone = ({ onDrop, uploading, uploadProgress }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`group relative overflow-hidden rounded-3xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all duration-500 min-h-[320px] cursor-pointer ${
        isDragActive
          ? 'border-primary bg-primary/20 shadow-2xl shadow-primary/5 scale-[1.01]'
          : 'border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10 hover:shadow-2xl hover:shadow-primary/5'
      }`}
    >
      <input {...getInputProps()} />
      <div className="z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container mb-4 shadow-xl animate-float">
          <span className="material-symbols-outlined text-[40px]">upload_file</span>
        </div>
        <h3 className="text-headline-md text-on-surface mb-2">
          {isDragActive ? 'Drop files here!' : 'Drop files here to upload'}
        </h3>
        <p className="text-on-surface-variant max-w-sm mb-6">
          Or click to browse your computer. Support for all file formats up to 2GB.
        </p>
        <div className="flex gap-4">
          <span className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform">
            Select Files
          </span>
        </div>
      </div>
      {uploading && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="glass-card rounded-xl p-4">
            <div className="flex justify-between text-body-sm mb-2">
              <span className="text-on-surface font-medium">Uploading...</span>
              <span className="text-primary font-bold">{uploadProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(173,198,255,0.6)] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;

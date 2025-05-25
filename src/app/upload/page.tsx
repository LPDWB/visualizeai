import FileUpload from '@/components/FileUpload';

export default function UploadPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Upload your CSV or XLSX files to view their contents.</p>
      <FileUpload />
    </div>
  );
} 
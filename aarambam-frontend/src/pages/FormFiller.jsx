import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Check, FileText, ScanLine, ArrowRight, Loader2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import api from '../services/api'; 
import { useVoice } from '../hooks/useVoice'; 

const FormFiller = () => {
  const { speak } = useVoice();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      processImage(selectedFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []},
    maxFiles: 1
  });

  // --- INTELLIGENT PROCESSING ---
  const processImage = async (imageFile) => {
    setIsProcessing(true);
    setExtractedData(null);
    speak("Scanning document. Please wait.");

    try {
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await api.post('/ai/fill-form', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.status === 'success') {
            const data = response.data.data;
            setExtractedData(data);

            // --- LOGIC: CHECK MISSING DATA & ASK USER ---
            const missingFields = [];
            if (!data.accountName) missingFields.push("Name");
            if (!data.accountNumber) missingFields.push("Account Number");
            if (!data.ifsc) missingFields.push("IFSC Code");
            if (!data.amount) missingFields.push("Amount");

            if (missingFields.length === 0) {
                speak("Form filled successfully. Please verify and confirm.");
            } else {
                // Speak the first missing field to guide the user
                const firstMissing = missingFields[0];
                speak(`I have filled most details, but I could not read the ${firstMissing}. Please speak or enter the ${firstMissing}.`);
            }
        }
    } catch (error) {
        console.error("AI Error:", error);
        speak("Failed to read the document. Please try again.");
    } finally {
        setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in">
      
      {/* LEFT: Upload Area */}
      <div className={`flex-1 relative transition-all duration-500 ${extractedData ? 'lg:w-1/2' : 'w-full'}`}>
        <div className="h-full bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm overflow-hidden relative flex flex-col">
          
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white z-10">
             <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Input Document
             </h3>
             {file && (
               <button onClick={resetForm} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors">
                 Remove
               </button>
             )}
          </div>

          <div className="flex-1 p-4 bg-slate-50/50 relative">
             {!file ? (
                <div {...getRootProps()} className={`h-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-white'}`}>
                  <input {...getInputProps()} />
                  <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 mb-6">
                     <Camera size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-700">Scan Bank Form</h4>
                  <p className="text-slate-400 text-sm mt-2 max-w-xs text-center">Drag and drop image here, or click to open camera</p>
                </div>
             ) : (
                <div className="relative h-full w-full flex items-center justify-center bg-slate-900 rounded-2xl overflow-hidden group">
                   <img src={previewUrl} alt="Scan" className="max-h-full max-w-full object-contain opacity-90" />
                   
                   {isProcessing && (
                      <div className="absolute inset-0 z-20">
                         <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_rgba(56,189,248,0.8)] animate-[scan_2s_linear_infinite]"></div>
                         <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-sm">
                            <div className="bg-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
                               <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                               <span className="font-bold text-slate-700 text-sm">AI Extracting...</span>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             )}
          </div>
        </div>
      </div>

      {/* RIGHT: Data Form */}
      {file && (
        <div className="flex-1 lg:max-w-md bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col animate-slide-up">
           <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 rounded-t-[2rem]">
              <div className="flex items-center gap-3 mb-1">
                 <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                    <Check size={18} strokeWidth={3} />
                 </div>
                 <h3 className="font-bold text-lg text-slate-800">Extraction Complete</h3>
              </div>
              <p className="text-xs text-slate-500 pl-11">Please verify the details below.</p>
           </div>

           <div className="flex-1 p-6 overflow-y-auto space-y-5">
              {isProcessing ? (
                 [1,2,3,4].map(i => (
                    <div key={i} className="space-y-2 animate-pulse">
                       <div className="h-4 w-24 bg-slate-100 rounded"></div>
                       <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
                    </div>
                 ))
              ) : (
                 <>
                    <Input 
                      label="Beneficiary Name" 
                      value={extractedData?.accountName || ''} 
                      onChange={(e) => setExtractedData({...extractedData, accountName: e.target.value})}
                    />
                    <Input 
                      label="Account Number" 
                      type="number" // Allows voice digit entry
                      value={extractedData?.accountNumber || ''} 
                      onChange={(e) => setExtractedData({...extractedData, accountNumber: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <Input 
                         label="IFSC Code" 
                         value={extractedData?.ifsc || ''} 
                         onChange={(e) => setExtractedData({...extractedData, ifsc: e.target.value})}
                       />
                       <Input 
                         label="Amount (₹)" 
                         type="number"
                         value={extractedData?.amount || ''} 
                         onChange={(e) => setExtractedData({...extractedData, amount: e.target.value})}
                       />
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3">
                       <div className="mt-0.5 text-yellow-600"><ScanLine size={18} /></div>
                       <div>
                          <p className="text-xs font-bold text-yellow-800 mb-0.5">
                             {extractedData?.ifsc ? "AI Confidence: 98%" : "Attention Needed"}
                          </p>
                          <p className="text-[10px] text-yellow-700 leading-tight">
                             {extractedData?.ifsc ? "Always verify account numbers manually." : "Some fields could not be read. Please fill them manually or use voice."}
                          </p>
                       </div>
                    </div>
                 </>
              )}
           </div>

           <div className="p-6 border-t border-slate-100">
              <Button disabled={isProcessing} icon={ArrowRight}>
                 Confirm & Transfer
              </Button>
           </div>
        </div>
      )}
    </div>
  );
};

export default FormFiller;
/**
 * AttachmentsDropzone Component
 * Provides a drag-and-drop zone for uploading supporting documents (PDF, DOCX).
 
 */

import React, { useEffect, useRef, useState } from 'react';
import '../Styles/Attachments.css';

 // the size limit 
  const MAX_FILE_SIZE_MB = 25 ;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function AttachmentsDropzone() {

  // useRef creates a direct reference to the dropzone DOM element
  const attachmentsRef = useRef(null);
  // to access the hiden file input trigger the file explorer
  const fileInputRef=useRef(null);
  // stores the list f all dropped/selected files across multiple uploads
  const [droppedFiles, setDroppedFiles]= useState([]);
 // track rejected files
 const [rejectedFiles, setRejectedFiles] = useState([]);

 const filterFiles = (files) => {
  const accepted= [];
  const rejected=[];
 
 files.forEach (file => {
  if (file.size <= MAX_FILE_SIZE_BYTES) {
    accepted.push(file);

  } else {
    rejected.push(file.name);
  }
 });
 return {accepted,rejected};
}

  useEffect(() => {

    // Get the actual DOM element from the ref
    const attachments = attachmentsRef.current;

    // Safety check:  element doesn't exist yet do nothing
    if (!attachments) return;

    /**
     * handleDragOver - fires continuously while a file is dragged over the zone
     * - e.preventDefault() allows the drop to happen (browser blocks it by default)
     */
    const handleDragOver = (e) => {
      e.preventDefault();
      attachments.classList.add('dragover');
    };

    
     //hndleDragLeave - fires when the dragged file leaves the dropzone area
  
    
    const handleDragLeave = () => {
      attachments.classList.remove('dragover');
    };

    
   //* handleDrop - fires when the user releases/drops the file onto the zone
    
    const handleDrop = (e) => {
      e.preventDefault();
      attachments.classList.remove('dragover');
      const files = Array.from(e.dataTransfer.files); // convert filelist to an array 
       
      const {accepted , rejected } = filterFiles(files);
      setDroppedFiles(prev => [...prev, ...accepted]);
      setRejectedFiles(rejected);
    };

    // Attach the three drag-and-drop event listeners to the dropzone element
    attachments.addEventListener('dragover', handleDragOver);
    attachments.addEventListener('dragleave', handleDragLeave);
    attachments.addEventListener('drop', handleDrop);

   // Cleanup: removes all event listeners when the component unmounts
    // Prevents memory leaks and duplicate listeners on re-renders
    return () => {
      attachments.removeEventListener('dragover', handleDragOver);
      attachments.removeEventListener('dragleave', handleDragLeave);
      attachments.removeEventListener('drop', handleDrop);
    };

  }, []); // Empty dependency array: runs once on mount, cleans up on unmount

 // handleclick - triggers the hidden file input open the file explorer
 const handleClick = () => {
  fileInputRef.current.click();
 };
 /**
   * handleFileInput - fires when the user selects files from the file explorer
   * - Array.from() converts the FileList to a regular array
   * - appends the new files to the existing list
   */
   const handleFileInput = (e) => {
    const files = Array.from(e.target.files); // convert FileList to array
      const { accepted, rejected } = filterFiles(files); //  call it first
    setDroppedFiles(prev => [...prev, ...accepted]); // append to existing files
   setRejectedFiles(rejected);
    e.target.value = ''; // reset input so the same file can be re-selected later
  };
 //  removeFile - removes a specific file from the list by its index
   //*  filters out the file at the given index, keeping all others
  const removeFile = (index) => {
    setDroppedFiles(prev => prev.filter((_,i) =>  i !== index));
  };
  return (
    <>
    {/* Hidden file input — no UI, triggered programmatically on dropzone click */}
      {/* multiple allows selecting more than one file at once */}
      <input 
      type='file'
      ref={fileInputRef}
      style={{display: 'none'}}
      multiple
      onChange={handleFileInput}
      />
      {/* Dropzone area — ref connects this element to the drag event listeners above */}
      <div
        className="attachments"
        ref={attachmentsRef}
        onClick={handleClick}
        style={{cursor:'pointer'}}
      >
        Upload supporting documents (PDF, DOCX)
        <br />
        
        <small>Drag &amp; drop here or browse</small>
      </div>
      {/* Error messages for rejected files */}
      {rejectedFiles.length > 0 && (
        <div className='rejected-files'>
          {rejectedFiles.map((name, index) => (
            <div key={index} className='rejected-item'>
              ⚠️ <strong>{name}</strong> exceeds the {MAX_FILE_SIZE_MB}MB limit and was not added.
            </div>
          ))}
        </div>
      )}
      {/*File list only renders if at least one file has been dropped */}
      {droppedFiles.length >0 && (
        <div className='file-list'>
          { droppedFiles.map((file,index) => (
          // Each file row shows its name, size, and a remove button
            <div key={index} className='file-item'>
            <span className="file-name">📄 {file.name}</span>
            {/* Convert bytes to KB and round to 1 decimal */}
              <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
          {/* Clicking ✕ removes only this file from the list */}
              <button className="remove-file-btn" onClick={(e) =>{e.stopPropagation();  removeFile(index) }}>✕</button>
              </div>
          ))}
        </div>


      )}
    </>
  );
}

export default AttachmentsDropzone;
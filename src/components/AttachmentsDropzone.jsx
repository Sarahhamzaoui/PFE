/**
 * AttachmentsDropzone Component
 * Provides a drag-and-drop zone for uploading supporting documents (PDF, DOCX).
 * Uses native DOM drag events attached via a React ref.
 */

import React, { useEffect, useRef } from 'react';

function AttachmentsDropzone() {

  // useRef creates a direct reference to the dropzone DOM element
  const attachmentsRef = useRef(null);

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
      const files = e.dataTransfer.files;
      console.log('Files dropped:', files);
      
    };

    // Attach the three drag-and-drop event listeners to the dropzone element
    attachments.addEventListener('dragover', handleDragOver);
    attachments.addEventListener('dragleave', handleDragLeave);
    attachments.addEventListener('drop', handleDrop);

    // Cleanup function: removes all event listeners when the component unmounts
    
    return () => {
      attachments.removeEventListener('dragover', handleDragOver);
      attachments.removeEventListener('dragleave', handleDragLeave);
      attachments.removeEventListener('drop', handleDrop);
    };

  }, []); // Empty dependency array: runs once on mount, cleans up on unmount

  return (
    <>
      {/* Dropzone area — ref connects this element to the drag event listeners above */}
      <div
        className="attachments"
        ref={attachmentsRef}
      >
        Upload supporting documents (PDF, DOCX)
        <br />
        
        <small>Drag &amp; drop here or browse</small>
      </div>
    </>
  );
}

export default AttachmentsDropzone;
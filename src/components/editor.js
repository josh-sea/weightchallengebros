import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import { Segment } from 'semantic-ui-react';
import 'quill/dist/quill.snow.css';

const Editor = forwardRef(({ readOnly, defaultValue, onKeyDown, onChange }, ref) => {
  const containerRef = useRef(null);
  const defaultValueRef = useRef(defaultValue);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div'),
    );

    // Initialize Quill editor
    const quill = new Quill(editorContainer, {
      theme: 'snow',
      readOnly: readOnly || false,
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'code-block'],
        ],
      },
    });

    ref.current = quill;

    // Set initial content if provided
    if (defaultValueRef.current) {
      quill.setContents(defaultValueRef.current);
    }

    // Handle text changes using Quill's API
    quill.on('text-change', () => {
      if (onChange) {
        onChange(quill.root.innerHTML);
      }
    });

    // Add keydown event listener directly via Quill's handler
    quill.keyboard.addBinding(
      { key: 'Enter', metaKey: true }, // Cmd+Enter on Mac
      handleHotKeys,
    );
    quill.keyboard.addBinding(
      { key: 'Enter', ctrlKey: true }, // Ctrl+Enter on other systems
      handleHotKeys,
    );

    function handleHotKeys(e) {
      if (onKeyDown) {
        onKeyDown(e);
      }
    }

    // Clean up on unmount
    return () => {
      ref.current = null;
      container.innerHTML = '';
    };
  }, [ref, readOnly]);

  return (
    <Segment basic style={{ padding: 0 }}>
      <div ref={containerRef} style={{ height: '8rem' }} />
    </Segment>
  );
});

Editor.displayName = 'Editor';

export default Editor;
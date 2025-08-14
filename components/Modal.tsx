import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmButtonLabel: string;
  onCancel?: () => void;
  cancelButtonLabel?: string;
}

const Modal: React.FC<ModalProps> = ({ title, children, onConfirm, confirmButtonLabel, onCancel, cancelButtonLabel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl p-6 md:p-8 max-w-sm w-full text-center transform transition-all animate-in">
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">{title}</h2>
        <div className="text-slate-300 mb-6 text-lg">{children}</div>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-800 w-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
          >
            {confirmButtonLabel}
          </button>
          {onCancel && cancelButtonLabel && (
            <button
              onClick={onCancel}
              className="bg-slate-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-slate-800 w-full"
            >
              {cancelButtonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
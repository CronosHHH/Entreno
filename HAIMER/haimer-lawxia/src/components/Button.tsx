import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'signIn' | 'headerLink' | 'inputAction' | 'mic';
  children: React.ReactNode;
}

const variantClasses = {
  signIn: 'bg-interactiveBlue text-textButtonPrimary rounded-pill px-8 py-3 text-lg font-semibold hover:bg-interactiveBlueHover transition',
  headerLink: 'bg-transparent text-textPrimary rounded-medium px-4 py-2 hover:bg-white/10 transition',
  inputAction: 'bg-componentSubtle text-textPrimary rounded-medium px-4 py-2 hover:bg-componentSubtleHover transition',
  mic: 'bg-transparent text-textSecondary p-2 rounded-full hover:bg-componentSubtle hover:text-textPrimary transition',
};

export default function Button({ variant = 'signIn', children, className = '', ...props }: ButtonProps) {
  return (
    <button className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
} 
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { BRAND_CONTACT } from '../data/midtownData';

export type LegalDocType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  docType: LegalDocType;
  onClose: () => void;
}

export function LegalModal({ docType, onClose }: LegalModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (docType && !dialog.open) {
      dialog.showModal();
    } else if (!docType && dialog.open) {
      dialog.close();
    }
  }, [docType]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onDialogClose = () => {
      dialog.returnValue = '';
      onClose();
    };
    dialog.addEventListener('close', onDialogClose);
    return () => dialog.removeEventListener('close', onDialogClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby="legal-modal-title"
      className="editorial-dialog m-auto w-[min(92vw,42rem)] max-h-[85svh] overflow-y-auto bg-[#F8F8F6] p-6 sm:p-8 text-[#0A0A0A] border border-[#E2E2DD] shadow-2xl"
    >
      {docType && (
        <div>
          <div className="flex items-start justify-between gap-4 border-b border-[#E2E2DD] pb-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#4B7F1E]">
                Midtown Property · Ahmedabad
              </p>
              <h1 id="legal-modal-title" className="mt-1 font-serif text-3xl font-medium">
                {docType === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close legal document"
              autoFocus
              className="inline-flex h-10 w-10 items-center justify-center border border-[#E2E2DD] bg-white hover:border-[#0A0A0A]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#3F3F44]">
            {docType === 'privacy' ? (
              <>
                <p>
                  {BRAND_CONTACT.company} respects your privacy. Information submitted through our consultation
                  form—such as your name, phone number, email address, and property preferences—is used strictly
                  to respond to your real estate inquiry and arrange site visits or advisory calls.
                </p>
                <p>
                  We do not sell, rent, or distribute personal contact details to unrelated third-party marketers.
                  For corrections or removal requests, write to{' '}
                  <a href={BRAND_CONTACT.emailHref} className="underline text-[#0A0A0A]">
                    {BRAND_CONTACT.email}
                  </a>{' '}
                  or contact our office at {BRAND_CONTACT.address}.
                </p>
              </>
            ) : (
              <>
                <p>
                  Property specifications, indicative price ranges, carpet/super built-up dimensions, and
                  possession timelines displayed on this website are curated for informational guidance based on
                  developer disclosures and active market mandates.
                </p>
                <p>
                  All transactions remain subject to independent legal due diligence, official RERA documentation,
                  and final allotment terms executed with the respective developer or seller.
                </p>
                <p className="font-mono text-xs text-[#57575C]">
                  RERA Registration: {BRAND_CONTACT.reraNo}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

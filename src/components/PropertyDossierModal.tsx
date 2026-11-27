import { useEffect, useRef } from 'react';
import { X, ArrowUpRight, MapPin, Building2, Check } from 'lucide-react';
import type { PropertyItem } from '../data/midtownData';

interface PropertyDossierModalProps {
  property: PropertyItem | null;
  onClose: () => void;
  onInquire: (property: PropertyItem) => void;
}

export function PropertyDossierModal({
  property,
  onClose,
  onInquire,
}: PropertyDossierModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const pressedOutsideRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (property && !dialog.open) {
      dialog.showModal();
    } else if (!property && dialog.open) {
      dialog.close();
    }
  }, [property]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      onClose();
    };
    dialog.addEventListener('close', handleClose);

    // Fallback for browsers lacking closedby="any" (Safari)
    let cleanupClosedBy: (() => void) | undefined;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const isOutside = (e: PointerEvent) => {
        const r = dialog.getBoundingClientRect();
        return (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        );
      };
      const onPointerDown = (e: PointerEvent) => {
        pressedOutsideRef.current = isOutside(e);
      };
      const onPointerUp = (e: PointerEvent) => {
        if (pressedOutsideRef.current && isOutside(e)) {
          dialog.close();
        }
      };
      dialog.addEventListener('pointerdown', onPointerDown);
      dialog.addEventListener('pointerup', onPointerUp);
      cleanupClosedBy = () => {
        dialog.removeEventListener('pointerdown', onPointerDown);
        dialog.removeEventListener('pointerup', onPointerUp);
      };
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      cleanupClosedBy?.();
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby="property-dossier-title"
      className="editorial-dialog m-auto w-[min(94vw,58rem)] max-h-[90svh] overflow-y-auto bg-[#F8F8F6] p-0 text-[#0A0A0A] border border-[#E2E2DD] shadow-2xl"
    >
      {property && (
        <div className="grid md:grid-cols-12">
          <div className="relative md:col-span-6 bg-[#0A0A0A] min-h-[260px] md:min-h-[460px]">
            <img
              src={property.image}
              alt={`${property.name} — ${property.location}`}
              className="h-full w-full object-cover"
            />
            {property.availability && (
              <span className="absolute left-4 top-4 bg-[#0A0A0A]/85 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#84C44C] backdrop-blur-sm">
                {property.availability}
              </span>
            )}
            {property.imageNote && (
              <p className="absolute inset-x-0 bottom-0 bg-[#0A0A0A]/80 px-4 py-2 text-[11px] text-white/80">
                {property.imageNote}
              </p>
            )}
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#4B7F1E]">
                    {property.category} · {property.propertyType}
                  </p>
                  <h1
                    id="property-dossier-title"
                    className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#0A0A0A]"
                  >
                    {property.name}
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  aria-label="Close property dossier"
                  autoFocus
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[#E2E2DD] bg-white text-[#0A0A0A] hover:border-[#0A0A0A]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-[#57575C]">
                <MapPin className="h-4 w-4 text-[#4B7F1E]" aria-hidden="true" />
                <span>{property.location}</span>
              </div>

              {property.developer && (
                <div className="mt-1.5 flex items-center gap-2 text-sm text-[#57575C]">
                  <Building2 className="h-4 w-4 text-[#57575C]" aria-hidden="true" />
                  <span>Developer: {property.developer}</span>
                </div>
              )}

              <p className="mt-5 text-sm leading-relaxed text-[#3F3F44]">
                {property.summary}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-[#E2E2DD] py-4 text-sm">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6E73]">
                    Configuration
                  </dt>
                  <dd className="mt-1 font-medium text-[#0A0A0A]">
                    {property.configuration}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6E73]">
                    Area
                  </dt>
                  <dd className="mt-1 font-medium text-[#0A0A0A]">
                    {property.area}
                  </dd>
                </div>
                {(property.price || property.priceNote) && (
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6E73]">
                      Price Indication
                    </dt>
                    <dd className="mt-1 font-medium text-[#0A0A0A]">
                      {property.price ?? property.priceNote}
                    </dd>
                  </div>
                )}
                {property.possession && (
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E6E73]">
                      Possession
                    </dt>
                    <dd className="mt-1 font-medium text-[#0A0A0A]">
                      {property.possession}
                    </dd>
                  </div>
                )}
              </dl>

              <ul className="mt-5 space-y-2">
                {property.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-xs text-[#3F3F44]">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4B7F1E]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-[#E2E2DD]">
              <button
                type="button"
                onClick={() => {
                  dialogRef.current?.close();
                  onInquire(property);
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 bg-[#0A0A0A] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#4B7F1E] transition-colors"
              >
                <span>Inquire About {property.name}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

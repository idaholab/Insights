// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useEffect, useState, ReactNode } from "react";
import ButtonBasic from "../elements/ButtonBasic";
import { useTheme } from "../../contexts/useTheme";

import ButtonIcon from "../elements/ButtonIcon";

type Props = {
    title?: string,
    content?: ReactNode,
    isOpen: boolean,
    onCloseClick: () => void
};

export const SimpleModal: React.FC<Props> = ({
    title,
    content,
    isOpen,
    onCloseClick
}) => {
    const { theme } = useTheme();

    // Dialog Actions
    const handleCloseDialog = () => {
        onCloseClick();
    };

    const modalRef = React.useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(isOpen);
    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current &&
                !modalRef.current.contains(event.target as Node)) {
                handleCloseDialog();
            }
        };

        if (open) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [open]);

    return (
        <>
            {open &&
                <div key={'attack-full-desc-modal-div2'} className={`fixed inset-0 opacity-70 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`} ></div>
            }

            <dialog
                key={'attack-full-desc-modal2'}
                id="attack-full-desc-modal"
                className="modal"
                open={open}
            >
                <div className={`modal-box max-w-[1000px] min-w-none p-12 shadow-md-neutralc-900
                    ${theme === 'dark' ? 'bg-neutralc-800 text-neutralc-100' : 'bg-neutralc-200 text-neutralc-900'}`}
                    ref={modalRef}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl mb-0 align-middle">{title}</h2>
                        <div className="-mr-4">
                            <ButtonIcon buttonSize={'btn-sm'} altTitle={'Close'} buttonIcon={'close'} color={'btn-ghost'} onClick={handleCloseDialog} />
                        </div>
                    </div>

                    <div className="modal-text-container">
                        <div className="modal-text py-4 pr-4 scroll-auto">{content}</div>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <ButtonBasic
                                label={'Close'}
                                type={'btn-primary'}
                                onClick={handleCloseDialog}
                            />
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}

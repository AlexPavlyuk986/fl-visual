import { useRef } from "react";


interface HeaderProps {
    onUpload: (file: File) => void;
}


function Header({
    onUpload
}: HeaderProps) {


    const inputRef = useRef<HTMLInputElement>(null);


    const handleClick = () => {
        inputRef.current?.click();
    };


    const handleFile = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            event.target.files?.[0];


        if (!file)
            return;


        onUpload(file);
    };


    return (
        <header className="header">

            <div className="upload-section">

                <button
                    onClick={handleClick}
                >
                    Upload
                </button>


                <input
                    ref={inputRef}
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={handleFile}
                />

            </div>

        </header>
    );
}


export default Header;
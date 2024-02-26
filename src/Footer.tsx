import { MarkGithubIcon } from '@primer/octicons-react';

const Footer = () => {
    return (
        <footer className=" absolute bottom-0 bg-gray-900 text-white p-2 w-full flex">
            <div className="container mx-auto flex items-center justify-center">
                <h1 className='text-xl'>&copy; Zeochat {new Date().getFullYear()}</h1>
            </div>
            <div className=" cursor-pointer hover:scale-110 py-1 md:mr-3">
                <a href='https://github.com/RuanUrb'><MarkGithubIcon size={24}/></a>
            </div>
        </footer>
    );
};

export default Footer;
import {React,useCallback,useState,useContext} from 'react';
import { useRouter } from 'next/router';
import { voterContext } from '../src/context/Voter';
import {useDropzone} from 'react-dropzone';

const allowedVoter = () => {
    const router = useRouter();
    const [fileUrl, setfileUrl] = useState(null);
    const [formInput, setformInput] = useState({
        name:"",
        address:"",
        position:""
    });
    const {UploadToIpfs} = useContext(voterContext);

    const onDrop = useCallback(async(acceptedfile)=>{
        const url = UploadToIpfs(acceptedfile[0]);
        setfileUrl(url);
    });

    const {getRootProps,getInputProps} = useDropzone({
        onDrop,
        accept:'image/*',
        maxSize:500000,
    });
    
  return (
    <div>
      
    </div>
  )
}

export default allowedVoter;
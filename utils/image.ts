import { CloudinaryOptions } from "../interfaces";

type resource_type = 'image' | 'video';
type folder = 'profile' | 'exercise' | 'routine' | string;

export const generateOptions = async (resource_type: resource_type, folder: folder, path: string, email: string) => {
  
  let options: CloudinaryOptions = {
    folder: `${email}/${folder}`,
    resource_type: resource_type,
    overwrite: true,
    unique_filename: true,
  };
  
  switch(resource_type){
    case 'image':
      options = (folder !== 'profile') ? {...options} : {...options, public_id: email, height: 56, width: 56 }
      break;
    case 'video':
      break;
  }
 
  const newPath: string = await toBase64(path[0]);
  return { path: newPath, options };
}


const toBase64 = (file: any) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});
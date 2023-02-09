
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export function usePhotoGallery() {

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      width: 2000,
      quality: 20,
    });
    return photo.webPath;
  };

  return {
    takePhoto
  }
}

// The base64FromPath method is a helper util that downloads a file from the supplied path 
// and returns a base64 representation of that file
export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('method did not return a string');
      }
    };
    reader.readAsDataURL(blob);
  });
}

export function getFileSizeFromBase64(base64String: string){
  return new Blob([base64String]).size
}

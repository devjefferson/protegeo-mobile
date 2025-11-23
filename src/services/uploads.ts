
import { supabase } from './supabase';

export interface ImageState extends File {
  preview: string;
}

export const serviceUploadsImage = async ({
  image,
  name,
  path,
}: {
  image: ImageState;
  name: string;
  path: string;
}) => {
  // Tentar primeiro com 'public/' e depois sem, caso o bucket já seja público
  const filePaths = [
    `public/${path}/${name}`,
    `${path}/${name}`,
  ];
  
  let lastError: Error | null = null;
  
  for (const filePath of filePaths) {
    try {
 
      
      // Fazer upload da imagem
      const {  error: uploadError } = await supabase.storage
        .from('protegeo')
        .upload(filePath, image, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Erro ao fazer upload:', uploadError);
        const errorMessage = uploadError.message || 'Erro desconhecido';
        lastError = new Error(`Erro ao fazer upload: ${errorMessage}`);
        
        // Se o erro for de bucket não encontrado ou permissão, não tentar outro caminho
        if (errorMessage.includes('Bucket not found') || 
            errorMessage.includes('new row violates') ||
            errorMessage.includes('not found') ||
            errorMessage.includes('permission denied')) {
          throw lastError;
        }
        
        // Tentar próximo caminho
        continue;
      }


      // Obter URL pública da imagem
      const { data: urlData } = supabase.storage
        .from('protegeo')
        .getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Erro ao obter URL pública da imagem');
      }


      return urlData.publicUrl;
    } catch (error) {
      // Se não for um erro de upload, propagar imediatamente
      if (error instanceof Error && !error.message.includes('upload')) {
        throw error;
      }
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }
  
  // Se chegou aqui, todos os caminhos falharam
  throw lastError || new Error('Erro ao fazer upload da imagem: todos os caminhos falharam');
};

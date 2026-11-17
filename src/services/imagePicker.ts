import * as ImagePicker from 'expo-image-picker';

export type PickImageResult =
    | { status: 'picked'; dataUri: string }
    | { status: 'cancelled' }
    | { status: 'denied' };

/** Abre a galeria e devolve a imagem escolhida como data URI base64. */
export async function pickImageAsDataUri(): Promise<PickImageResult> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return { status: 'denied' };

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
    });

    if (result.canceled) return { status: 'cancelled' };

    const asset = result.assets[0];
    return {
        status: 'picked',
        dataUri: `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`,
    };
}

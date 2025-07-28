// 👇️ Расширяем типизацию для нестандартного модуля cypress-otp
declare module 'cypress-otp' {
	/**
	 * Генерирует одноразовый токен на основе предоставленного секрета.
	 * Используется в 2FA/OTP-сценариях в E2E-тестах (например, при авторизации).
	 *
	 * @param secret - Секрет (base32 или другой формат, совместимый с OTP)
	 * @returns Одноразовый 6-значный токен в виде строки
	 *
	 * @example
	 * import generateOTPToken from 'cypress-otp';
	 * const token = generateOTPToken('KZ4X2...'); // => '384159'
	 */
	// eslint-disable-next-line import/no-default-export
	export default function generateOTPToken(secret: string): string;
}

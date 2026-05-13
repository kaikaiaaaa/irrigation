export interface StorageInfo {
  used: number;
  total: number;
  percentage: number;
  isWarning: boolean;
  isCritical: boolean;
}

export function getStorageInfo(): StorageInfo {
  try {
    let used = 0;
    
    // 计算LocalStorage使用量
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        used += key.length + value.length;
      }
    }
    
    // 估算总容量 (通常为5-10MB)
    const total = 5 * 1024 * 1024; // 5MB
    const percentage = Math.round((used / total) * 100);
    
    return {
      used,
      total,
      percentage,
      isWarning: percentage >= 80,
      isCritical: percentage >= 95,
    };
  } catch {
    return {
      used: 0,
      total: 5 * 1024 * 1024,
      percentage: 0,
      isWarning: false,
      isCritical: false,
    };
  }
}

export function formatStorageSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function checkStorageQuota(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

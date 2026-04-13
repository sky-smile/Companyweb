'use client';

import { useEffect, useRef } from 'react';

// 修复 Leaflet 标记图标路径问题
const defaultIconConfig = {
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
};

interface ContactMapProps {
  address: string;
  latitude: number;
  longitude: number;
}

export function ContactMap({ address, latitude, longitude }: ContactMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      if (!mapRef.current || !latitude || !longitude) return;

      // 动态导入 leaflet CSS 和库（仅在客户端）
      await import('leaflet/dist/leaflet.css');
      const L = (await import('leaflet')).default;
      if (!mounted) return;

      // 避免重复初始化
      if (leafletRef.current) {
        leafletRef.current.remove();
      }

      // 创建图标
      const defaultIcon = L.icon(defaultIconConfig);

      // 创建地图实例
      const map = L.map(mapRef.current).setView([latitude, longitude], 15);
      leafletRef.current = map;

      // 添加 OpenStreetMap 图层
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // 添加标记
      L.marker([latitude, longitude], { icon: defaultIcon })
        .addTo(map)
        .bindPopup(address || '公司地址')
        .openPopup();

      // 确保地图正确渲染
      setTimeout(() => {
        if (mounted) {
          map.invalidateSize();
        }
      }, 100);
    };

    initMap();

    return () => {
      mounted = false;
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, [latitude, longitude, address]);

  if (!latitude || !longitude) {
    return (
      <div className="contact-map-placeholder">
        <p>暂无地图信息</p>
      </div>
    );
  }

  return <div ref={mapRef} className="contact-map-inner" style={{ width: '100%', height: '100%' }} />;
}

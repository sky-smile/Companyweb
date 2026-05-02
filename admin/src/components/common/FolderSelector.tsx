import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Button,
  Input,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  FolderOutlined,
  FolderAddOutlined,
  ArrowUpOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { uploadService } from '../../services/upload-service';
import { useMessage } from '../../hooks/useMessage';
import { getErrorMessage } from '../../lib/error-utils';

const { Text } = Typography;

interface FolderSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function FolderSelector({ value = 'common', onChange, disabled = false }: FolderSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(value);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);
  const message = useMessage();

  // 用 ref 持久化本地创建的文件夹，防止被 API 数据覆盖
  const localFoldersRef = useRef<Set<string>>(new Set());

  // 加载文件夹列表
  const loadFolders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await uploadService.getStatistics();
      const folderList = response.data?.byFolder?.map((item: { folder: string }) => item.folder) || [];
      // 添加默认文件夹
      const defaultFolders = ['common', 'banners', 'news', 'products', 'announcements', 'content-files', 'logos'];
      // 合并 API 数据和本地创建的文件夹
      const allFolders = Array.from(
        new Set([...defaultFolders, ...folderList, ...localFoldersRef.current])
      ).sort();
      setFolders(allFolders);
    } catch (error) {
      message.error(getErrorMessage(error, '加载文件夹列表失败'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (modalVisible) {
      loadFolders();
      setCurrentFolder(value);
    }
  }, [modalVisible, value, loadFolders]);

  // 确认选择
  const handleConfirm = () => {
    if (currentFolder && currentFolder.trim()) {
      onChange?.(currentFolder.trim());
      setModalVisible(false);
      message.success(`已选择文件夹: ${currentFolder}`);
    }
  };

  // 创建新文件夹
  const handleCreateFolder = () => {
    if (newFolderName && newFolderName.trim()) {
      const trimmedName = newFolderName.trim().toLowerCase();
      // 验证文件夹名称
      if (!/^[a-z0-9_-]+$/.test(trimmedName)) {
        message.error('文件夹名称只能包含小写字母、数字、下划线和连字符');
        return;
      }
      if (folders.includes(trimmedName)) {
        message.warning('文件夹已存在');
        return;
      }
      // 添加到本地持久化 ref
      localFoldersRef.current.add(trimmedName);
      // 更新列表显示
      const newFolders = [...folders, trimmedName].sort();
      setFolders(newFolders);
      setCurrentFolder(trimmedName);
      setNewFolderName('');
      setShowCreateInput(false);
      message.success(`已创建文件夹: ${trimmedName}`);
    }
  };

  // 过滤文件夹
  const filteredFolders = folders.filter(folder =>
    folder.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 获取文件夹文件数量
  const getFolderCount = (folder: string) => {
    return folders.indexOf(folder) >= 0 ? '' : '';
  };

  return (
    <>
      <Space>
        <Tag
          icon={<FolderOutlined />}
          color="blue"
          style={{
            padding: '6px 12px',
            fontSize: 14,
            cursor: disabled ? 'not-allowed' : 'pointer',
            minWidth: 120,
            textAlign: 'center',
          }}
          onClick={() => !disabled && setModalVisible(true)}
        >
          {value || 'common'}
        </Tag>
        {!disabled && (
          <Button
            type="link"
            onClick={() => setModalVisible(true)}
          >
            选择目录
          </Button>
        )}
      </Space>

      <Modal
        title={
          <Space>
            <FolderOutlined />
            <span>选择上传目录</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleConfirm}
        okText="确认选择"
        cancelText="取消"
        width={600}
      >
        <Space orientation="vertical" size={16} style={{ display: 'flex', width: '100%' }}>
          {/* 当前选择提示 */}
          <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
            <Text type="secondary">当前选择：</Text>
            <Tag color="blue" style={{ margin: 0 }}>
              {currentFolder}
            </Tag>
          </div>

          {/* 搜索框 */}
          <Input
            placeholder="搜索文件夹名称"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
          />

          {/* 创建新文件夹 */}
          {showCreateInput ? (
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="输入新文件夹名称（小写字母、数字、下划线、连字符）"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value.toLowerCase())}
                onPressEnter={handleCreateFolder}
                prefix={<FolderAddOutlined />}
              />
              <Button type="primary" onClick={handleCreateFolder}>
                创建
              </Button>
              <Button onClick={() => { setShowCreateInput(false); setNewFolderName(''); }}>
                取消
              </Button>
            </Space.Compact>
          ) : (
            <Button
              type="dashed"
              icon={<FolderAddOutlined />}
              onClick={() => setShowCreateInput(true)}
              block
            >
              创建新文件夹
            </Button>
          )}

          {/* 文件夹列表 */}
          <Spin spinning={loading}>
            <div style={{ maxHeight: 300, overflow: 'auto' }}>
              {filteredFolders.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: '#999' }}>
                  {searchKeyword ? '未找到匹配的文件夹' : '暂无文件夹'}
                </div>
              ) : (
                filteredFolders.map((folder) => (
                  <div
                    key={folder}
                    style={{
                      cursor: 'pointer',
                      padding: '12px 16px',
                      background: currentFolder === folder ? '#e6f7ff' : 'transparent',
                      borderRadius: 4,
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setCurrentFolder(folder)}
                    onMouseEnter={(e) => {
                      if (currentFolder !== folder) {
                        e.currentTarget.style.background = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentFolder !== folder) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space>
                        <FolderOutlined
                          style={{
                            color: currentFolder === folder ? '#1890ff' : '#8c8c8c',
                            fontSize: 18,
                          }}
                        />
                        <Tooltip title={folder}>
                          <Text
                            strong={currentFolder === folder}
                            style={{
                              color: currentFolder === folder ? '#1890ff' : 'inherit',
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              display: 'inline-block',
                            }}
                          >
                            {folder}
                          </Text>
                        </Tooltip>
                      </Space>
                      {currentFolder === folder && (
                        <Tag color="green" style={{ margin: 0 }}>已选择</Tag>
                      )}
                    </Space>
                  </div>
                ))
              )}
            </div>
          </Spin>

          {/* 常用文件夹快捷提示 */}
          {!searchKeyword && (
            <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                常用文件夹：common（通用）、banners（横幅）、news（新闻）、products（产品）、announcements（公告）、content-files（内容文件）、logos（标志）
              </Text>
            </div>
          )}
        </Space>
      </Modal>
    </>
  );
}

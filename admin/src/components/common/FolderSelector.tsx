import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Input,
  List,
  Modal,
  Space,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import {
  FolderOutlined,
  FolderAddOutlined,
  ArrowUpOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { uploadService } from '../../services/upload-service';

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

  // 加载文件夹列表
  const loadFolders = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await uploadService.getStatistics();
      const folderList = response.data?.byFolder?.map((item: any) => item.folder) || [];
      // 添加默认文件夹
      const defaultFolders = ['common', 'banners', 'news', 'products', 'announcements'];
      const allFolders = Array.from(new Set([...defaultFolders, ...folderList]));
      setFolders(allFolders.sort());
    } catch (error: any) {
      message.error('加载文件夹列表失败');
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
        <Space direction="vertical" size={16} style={{ display: 'flex', width: '100%' }}>
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
          <List
            loading={loading}
            dataSource={filteredFolders}
            locale={{ emptyText: searchKeyword ? '未找到匹配的文件夹' : '暂无文件夹' }}
            style={{ maxHeight: 300, overflow: 'auto' }}
            renderItem={(folder) => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  padding: '12px 16px',
                  background: currentFolder === folder ? '#e6f7ff' : 'transparent',
                  borderRadius: 4,
                  transition: 'all 0.2s',
                }}
                onClick={() => setCurrentFolder(folder)}
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
              </List.Item>
            )}
          />

          {/* 常用文件夹快捷提示 */}
          {!searchKeyword && (
            <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                常用文件夹：common（通用）、banners（横幅）、news（新闻）、products（产品）、announcements（公告）
              </Text>
            </div>
          )}
        </Space>
      </Modal>
    </>
  );
}

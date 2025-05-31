import {
	Layout,
	Typography,
	Card,
	Row,
	Col,
	Statistic,
	List,
	Avatar,
} from 'antd'
import React from 'react'
import styled from 'styled-components'
import {
	AppHeader,
	ResizableSidebar,
	useSidebarState,
} from '@/layout/home-layout'

const { Content } = Layout
const { Title, Paragraph } = Typography

const StyledContent = styled(Content)`
	padding: 24px;
	margin: 0;
	min-height: 280px;
`

const StyledCard = styled(Card)`
	margin-bottom: 24px;
	border-radius: 8px;
`

interface HomeProps {
	defaultSidebarWidth?: number
	minSidebarWidth?: number
	maxSidebarWidth?: number
}

export const Home: React.FC<HomeProps> = ({
	defaultSidebarWidth = 200,
	minSidebarWidth = 120,
	maxSidebarWidth = 600,
}) => {
	const { collapsed, setCollapsed, siderWidth, isDragging, startResizing } =
		useSidebarState({
			defaultWidth: defaultSidebarWidth,
			minWidth: minSidebarWidth,
			maxWidth: maxSidebarWidth,
		})

	// Mock data for the dashboard
	const stats = [
		{ title: 'Active Users', value: 846, suffix: 'users' },
		{ title: 'Total Revenue', value: 9280, prefix: '$' },
		{ title: 'Tasks Completed', value: 78, suffix: '%' },
		{ title: 'New Customers', value: 32, suffix: 'today' },
	]

	const recentActivities = [
		{
			user: 'John Doe',
			action: 'created a new project',
			time: '5 minutes ago',
		},
		{ user: 'Jane Smith', action: 'completed a task', time: '10 minutes ago' },
		{ user: 'Mike Johnson', action: 'added a comment', time: '30 minutes ago' },
		{ user: 'Sarah Williams', action: 'uploaded a file', time: '1 hour ago' },
	]

	return (
		<Layout>
			<Layout
				style={{ minHeight: '100vh' }}
				hasSider={true}
			>
				<ResizableSidebar
					collapsed={collapsed}
					siderWidth={siderWidth}
					isDragging={isDragging}
					startResizing={startResizing}
					collapsedWidth={0}
					handleWidth={3}
				/>
				<Layout>
					<AppHeader
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
					<StyledContent>
						<Title level={2}>Dashboard</Title>
						<Paragraph type='secondary'>
							Welcome to your dashboard. Here's an overview of your activity.
						</Paragraph>

						<Row gutter={[16, 16]}>
							{stats.map((stat, index) => (
								<Col
									xs={24}
									sm={12}
									md={6}
									key={index}
								>
									<StyledCard>
										<Statistic
											title={stat.title}
											value={stat.value}
											prefix={stat.prefix}
											suffix={stat.suffix}
										/>
									</StyledCard>
								</Col>
							))}
						</Row>

						<StyledCard title='Recent Activities'>
							<List
								itemLayout='horizontal'
								dataSource={recentActivities}
								renderItem={(item) => (
									<List.Item>
										<List.Item.Meta
											avatar={<Avatar>{item.user.charAt(0)}</Avatar>}
											title={item.user}
											description={`${item.action} • ${item.time}`}
										/>
									</List.Item>
								)}
							/>
						</StyledCard>

						<Row gutter={16}>
							<Col span={12}>
								<StyledCard title='Quick Actions'>
									{/* Content for quick actions */}
									<Paragraph>
										You can add your quick action buttons here.
									</Paragraph>
								</StyledCard>
							</Col>
							<Col span={12}>
								<StyledCard title='Notifications'>
									{/* Content for notifications */}
									<Paragraph>
										Your recent notifications will appear here.
									</Paragraph>
								</StyledCard>
							</Col>
						</Row>
					</StyledContent>
					<StyledContent>
						<Title level={2}>Dashboard</Title>
						<Paragraph type='secondary'>
							Welcome to your dashboard. Here's an overview of your activity.
						</Paragraph>

						<Row gutter={[16, 16]}>
							{stats.map((stat, index) => (
								<Col
									xs={24}
									sm={12}
									md={6}
									key={index}
								>
									<StyledCard>
										<Statistic
											title={stat.title}
											value={stat.value}
											prefix={stat.prefix}
											suffix={stat.suffix}
										/>
									</StyledCard>
								</Col>
							))}
						</Row>

						<StyledCard title='Recent Activities'>
							<List
								itemLayout='horizontal'
								dataSource={recentActivities}
								renderItem={(item) => (
									<List.Item>
										<List.Item.Meta
											avatar={<Avatar>{item.user.charAt(0)}</Avatar>}
											title={item.user}
											description={`${item.action} • ${item.time}`}
										/>
									</List.Item>
								)}
							/>
						</StyledCard>

						<Row gutter={16}>
							<Col span={12}>
								<StyledCard title='Quick Actions'>
									{/* Content for quick actions */}
									<Paragraph>
										You can add your quick action buttons here.
									</Paragraph>
								</StyledCard>
							</Col>
							<Col span={12}>
								<StyledCard title='Notifications'>
									{/* Content for notifications */}
									<Paragraph>
										Your recent notifications will appear here.
									</Paragraph>
								</StyledCard>
							</Col>
						</Row>
					</StyledContent>
				</Layout>
			</Layout>
		</Layout>
	)
}

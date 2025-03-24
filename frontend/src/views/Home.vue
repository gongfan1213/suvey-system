<template>
  <div class="row">
    <div class="col-md-5">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h4>调查表单 Survey Form</h4>
        </div>
        <div class="card-body">
          <survey-form @submit-success="handleSubmitSuccess" />
        </div>
      </div>
    </div>
    
    <div class="col-md-7" v-if="showResults">
      <div class="card mb-4">
        <div class="card-header bg-success text-white">
          <h4>调查结果 Survey Results</h4>
        </div>
        <div class="card-body">
          <ul class="nav nav-tabs" id="resultTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="charts-tab" data-bs-toggle="tab" data-bs-target="#charts" type="button" role="tab" aria-controls="charts" aria-selected="true">图表 Charts</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="table-tab" data-bs-toggle="tab" data-bs-target="#table" type="button" role="tab" aria-controls="table" aria-selected="false">数据表 Data Table</button>
            </li>
          </ul>
          
          <div class="tab-content p-3" id="resultTabsContent">
            <div class="tab-pane fade show active" id="charts" role="tabpanel" aria-labelledby="charts-tab">
              <div class="row">
                <div class="col-md-12 mb-4">
                  <h5>年龄分布 Age Distribution</h5>
                  <age-chart :data="responses" />
                </div>
                <div class="col-md-6 mb-4">
                  <h5>性别分布 Gender Distribution</h5>
                  <gender-chart :data="responses" />
                </div>
                <div class="col-md-6 mb-4">
                  <h5>满意度评分 Satisfaction Rating</h5>
                  <satisfaction-chart :data="responses" />
                </div>
              </div>
            </div>
            
            <div class="tab-pane fade" id="table" role="tabpanel" aria-labelledby="table-tab">
              <responses-table :data="responses" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import SurveyForm from '@/components/SurveyForm.vue';
import AgeChart from '@/components/charts/AgeChart.vue';
import GenderChart from '@/components/charts/GenderChart.vue';
import SatisfactionChart from '@/components/charts/SatisfactionChart.vue';
import ResponsesTable from '@/components/ResponsesTable.vue';

export default {
  name: 'Home',
  components: {
    SurveyForm,
    AgeChart,
    GenderChart,
    SatisfactionChart,
    ResponsesTable
  },
  setup() {
    const responses = ref([]);
    const showResults = ref(false);
    
    const fetchResponses = async () => {
      try {
        // 使用完整的 URL
        const response = await axios.get('http://localhost:3000/api/responses');
        responses.value = response.data;
        showResults.value = response.data.length > 0;
      } catch (error) {
        console.error('Error fetching responses:', error);
        alert('无法连接到服务器，请确保后端服务正在运行 Cannot connect to server, please ensure backend service is running');
        
        // 使用模拟数据进行测试
        if (confirm('是否使用模拟数据进行测试？Would you like to use mock data for testing?')) {
          responses.value = [
            { name: '张三', email: 'zhangsan@example.com', age: 25, gender: '男', occupation: '工程师', languages: ['JavaScript', 'Python'], satisfaction: 8, feedback: '很好的系统！' },
            { name: '李四', email: 'lisi@example.com', age: 30, gender: '女', occupation: '教师', languages: ['Java', 'C++'], satisfaction: 7, feedback: '界面友好，功能完善。' },
            { name: '王五', email: 'wangwu@example.com', age: 22, gender: '男', occupation: '学生', languages: ['Python', 'JavaScript'], satisfaction: 9, feedback: '非常满意！' }
          ];
          showResults.value = true;
        }
      }
    };
    
    const handleSubmitSuccess = (newResponse) => {
      responses.value.push(newResponse);
      showResults.value = true;
    };
    
    onMounted(fetchResponses);
    
    return {
      responses,
      showResults,
      handleSubmitSuccess
    };
  }
}
</script>
<template>
  <form @submit.prevent="submitForm">
    <div class="mb-3">
      <label for="name" class="form-label">姓名 Name</label>
      <input type="text" class="form-control" id="name" v-model="formData.name" required>
    </div>
    
    <div class="mb-3">
      <label for="email" class="form-label">电子邮件 Email</label>
      <input type="email" class="form-control" id="email" v-model="formData.email" required>
    </div>
    
    <div class="mb-3">
      <label for="age" class="form-label">年龄 Age</label>
      <input type="number" class="form-control" id="age" v-model.number="formData.age" min="18" max="100" required>
    </div>
    
    <div class="mb-3">
      <label class="form-label">性别 Gender</label>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="gender" id="male" value="男" v-model="formData.gender" required>
        <label class="form-check-label" for="male">男 Male</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="gender" id="female" value="女" v-model="formData.gender">
        <label class="form-check-label" for="female">女 Female</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="gender" id="other" value="其他" v-model="formData.gender">
        <label class="form-check-label" for="other">其他 Other</label>
      </div>
    </div>
    
    <div class="mb-3">
      <label for="occupation" class="form-label">职业 Occupation</label>
      <select class="form-select" id="occupation" v-model="formData.occupation" required>
        <option value="">请选择... Please select...</option>
        <option value="学生">学生 Student</option>
        <option value="教师">教师 Teacher</option>
        <option value="工程师">工程师 Engineer</option>
        <option value="医生">医生 Doctor</option>
        <option value="其他">其他 Other</option>
      </select>
    </div>
    
    <div class="mb-3">
      <label class="form-label">您使用过哪些编程语言？（可多选）Which programming languages have you used? (Multiple choices)</label>
      <!-- 编程语言选项保持不变，因为都是英文 -->
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="javascript" value="JavaScript" v-model="formData.languages">
        <label class="form-check-label" for="javascript">JavaScript</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="python" value="Python" v-model="formData.languages">
        <label class="form-check-label" for="python">Python</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="java" value="Java" v-model="formData.languages">
        <label class="form-check-label" for="java">Java</label>
      </div>
    </div>
    
    <div class="mb-3">
      <label for="satisfaction" class="form-label">您对我们的服务满意度（1-10）Service Satisfaction Rating (1-10)</label>
      <input type="range" class="form-range" id="satisfaction" min="1" max="10" v-model.number="formData.satisfaction">
      <div class="text-center">{{ formData.satisfaction }}</div>
    </div>
    
    <div class="mb-3">
      <label for="feedback" class="form-label">您的反馈 Your Feedback</label>
      <textarea class="form-control" id="feedback" rows="3" v-model="formData.feedback"></textarea>
    </div>
    
    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
      {{ isSubmitting ? '提交中... Submitting...' : '提交调查 Submit Survey' }}
    </button>
  </form>
</template>

<script>
import { ref, reactive } from 'vue';
import axios from 'axios';

export default {
  name: 'SurveyForm',
  emits: ['submit-success'],
  setup(props, { emit }) {
    const formData = reactive({
      name: '',
      email: '',
      age: null,
      gender: '',
      occupation: '',
      languages: [],
      satisfaction: 5,
      feedback: ''
    });
    
    const isSubmitting = ref(false);
    
    const submitForm = async () => {
      isSubmitting.value = true;
      
      try {
        // 使用完整的 URL
        const response = await axios.post('http://localhost:3000/api/responses', formData);
        emit('submit-success', response.data);
        
        // 重置表单
        formData.name = '';
        formData.email = '';
        formData.age = null;
        formData.gender = '';
        formData.occupation = '';
        formData.languages = [];
        formData.satisfaction = 5;
        formData.feedback = '';
        
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('提交失败，请稍后再试 Submission failed, please try again later');
      } finally {
        isSubmitting.value = false;
      }
    };
    
    return {
      formData,
      isSubmitting,
      submitForm
    };
  }
}
</script>

<style scoped>
.form-range::-webkit-slider-thumb {
  background: #0d6efd;
}
.form-range::-moz-range-thumb {
  background: #0d6efd;
}
.form-range::-ms-thumb {
  background: #0d6efd;
}

.text-center {
  margin-top: 5px;
  font-weight: bold;
}

button[type="submit"] {
  width: 100%;
  margin-top: 10px;
}
</style>
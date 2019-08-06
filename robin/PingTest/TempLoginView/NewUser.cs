using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Robin
{
    public partial class NewUser : Form
    {
        public NewUser()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            
        }

        private void button1_Click(object sender, EventArgs e)
        {

        }

        private void button4_Click(object sender, EventArgs e)
        {
            this.Close();
            Environment.Exit(1);
        }

        private void button3_Click(object sender, EventArgs e)
        {
           

            if (!string.IsNullOrEmpty(username.Text))
            {
                Microsoft.Win32.RegistryKey rkey;
                rkey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey("Natagora");
                rkey.SetValue("Username", username.Text);
                rkey.Close();
                this.Close();
            }
            else {
                MessageBox.Show("aucun user");
            }

           
        }

        private void username_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                this.button3.PerformClick();
                e.SuppressKeyPress = true;
                e.Handled = true;
            }
        }

        private void NewUser_Load(object sender, EventArgs e)
        {
            
        }
    }
}
